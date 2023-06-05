using System.Net;
using System.Net.Mail;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using WebAPI.Dtos;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
   // [Authorize]
    public class SurveyController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public SurveyController(IUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        // ADMIN FUNCTIONS -----------------------------------------------------------

        // GET api/survey/surveys -- Get all surveys, WITHOUT Q&A
        [HttpGet("surveys")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllSurveys()
        {
            var surveys = await uow.SurveyRepository.GetAllSurveysAsync();
            var SurveyDto = mapper.Map<IEnumerable<SurveyDto>>(surveys);
            return Ok(SurveyDto);
        }

        // GET api/survey/completeSurveys -- Get all surveys, WITH Q&A
        [HttpGet("completeSurveys")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCompleteSurveys()
        {
            var surveyIDs = await uow.SurveyRepository.GetAllSurveyIDsAsync();
            var allCompleteSurveys = new List<SurveyCompleteDto>();
            foreach( var surveyID in surveyIDs) {
                var surveyCompleteReq = await this.GetSurveyAsync(surveyID);
                if (surveyCompleteReq is OkObjectResult okResult)
                {
                    var surveyCompleteDto = okResult.Value as SurveyCompleteDto;
                    if (surveyCompleteDto != null)
                    {
                        allCompleteSurveys.Add(surveyCompleteDto);
                    }
                }
            }
            return Ok(allCompleteSurveys);
        }

        // GET api/survey/surveys/{id}-- Get survey WITH Q&A using id
        [HttpGet("surveys/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSurveyAsync(int id)
        {
            var survey = await uow.SurveyRepository.FindSurvey(id);
            var surveyCompleteDto = mapper.Map<SurveyCompleteDto>(survey);
            var questions = await uow.SurveyRepository.GetSurveyQuestionsAsync(id);
            var surveyQuestionsDto = mapper.Map<IEnumerable<SurveyQuestionDto>>(questions);

            var jsonQuestionsList = new List<JObject>();

            foreach (SurveyQuestionDto question in surveyQuestionsDto) {
                var jsonQuestion =  JObject.FromObject(question);

                var options = await uow.SurveyRepository.GetQuestionsOptionsAsync(id, question.questionID);
                var surveyOptionsDto = mapper.Map<IEnumerable<SurveyOptionDto>>(options);

                var jsonOptionsList = new List<JObject>();

                foreach (SurveyOptionDto option in surveyOptionsDto) {
                    var jsonOption = JObject.FromObject(option);
                    jsonOptionsList.Add(jsonOption);
                }
                
                
                jsonQuestion.Add("options", JArray.FromObject(jsonOptionsList));

                jsonQuestionsList.Add(jsonQuestion);
            }

            surveyCompleteDto.questionsAndAnswers = jsonQuestionsList;

            return Ok(surveyCompleteDto);
        }

        // POST api/survey/post -- Post data in JSON format
        [HttpPost("post")]
        public async Task<IActionResult> AddSurvey(SurveyCompleteDto SurveyDto)
        {
            var survey = mapper.Map<Survey>(SurveyDto);
            uow.SurveyRepository.AddSurvey(survey);
            await uow.SaveAsync();

            SurveyQuestion[] questions = new SurveyQuestion[SurveyDto.questionsAndAnswers.Count];
            Console.WriteLine(questions);
            foreach (JObject q in SurveyDto.questionsAndAnswers) {
                SurveyQuestion surveyQuestion = new SurveyQuestion();
                surveyQuestion.questionID = int.Parse(q["questionID"].ToString());
                surveyQuestion.surveyID = survey.surveyID;
                surveyQuestion.question = q["question"].ToString();
                surveyQuestion.numberOfAnswers = int.Parse(q["numberOfAnswers"].ToString());
                uow.SurveyRepository.AddSurveyQuestion(surveyQuestion);
                await uow.SaveAsync();
                JArray qOptions = (JArray) q["options"];
                foreach (JObject o in qOptions) {
                    SurveyOption surveyOption = new SurveyOption();
                    surveyOption.answerID = int.Parse(o["answerID"].ToString());
                    surveyOption.surveyID = survey.surveyID;
                    surveyOption.questionID = surveyQuestion.questionID;
                    surveyOption.answer = o["answer"].ToString();
                    uow.SurveyRepository.AddSurveyOption(surveyOption);
                    await uow.SaveAsync();
                }
            }
            return StatusCode(201);
        }

        // GET api/survey/answers/{surveyID} -- Get all answers for a survey
        [HttpGet("answers/{surveyID}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSurveyAnswers(int surveyID)
        {
            var assignees = await uow.SurveyRepository.GetSurveyAssigneesBySurveyAsync(surveyID);
            var answers = new List<SurveyUserAnswerDto>();

            foreach (var assignee in assignees) {
                var questionAndAnswerIDs = new List<UserAnswerDto>();
                var user = await uow.UserRepository.GetUserNameAsync(assignee.userID);

                var assigneesAnswers = await uow.SurveyRepository.GetSurveyAnswersByIDAsync(surveyID, assignee.userID);
                foreach (var assigneeAnswer in assigneesAnswers) {
                    var userAnswerDto = new UserAnswerDto();
                    userAnswerDto.questionID = assigneeAnswer.questionID;
                    userAnswerDto.answerID = assigneeAnswer.answerID;
                    questionAndAnswerIDs.Add(userAnswerDto);
                }

                var answer = new SurveyUserAnswerDto();
                answer.surveyID = surveyID;
                answer.username = user.userName;
                answer.questionAndAnswerIDs = questionAndAnswerIDs;

                answers.Add(answer);
            }   
            return Ok(answers);
        }
        
        // GET api/survey/user/answers/{username}/{surveyID} -- Get the user's answers for a filled out survey
        [HttpGet("user/answers/{username}/{surveyID}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserAnswersForSurvey(string userName, int surveyID)
        {
            var questionAndAnswerIDs = new List<UserAnswerDto>();
            var user = await uow.UserRepository.GetUserAsync(userName);
            if (user == null) {
                return BadRequest("User not found");
            }
            var userID = user.userID;

            var usersAnswers = new CompleteSurveyUserAnswerDto();
            var questionsAndAnswers = new List<CompleteUserAnswerDto>();

            var assigneesAnswers = await uow.SurveyRepository.GetSurveyAnswersByIDAsync(surveyID, userID);
            foreach (var assigneeAnswer in assigneesAnswers) {
                var userAnswerDto = new CompleteUserAnswerDto();
                userAnswerDto.questionID = assigneeAnswer.questionID;
                userAnswerDto.answerID = assigneeAnswer.answerID;

                var questionDetails = await uow.SurveyRepository.GetQuestionDetails(surveyID, assigneeAnswer.questionID);
                var questionDetailsDto = mapper.Map<SurveyQuestionDto>(questionDetails);
                var answerDetails = await uow.SurveyRepository.GetAnswerDetails(surveyID, assigneeAnswer.questionID, assigneeAnswer.answerID);
                var answerDetailsDto = mapper.Map<SurveyOptionDto>(answerDetails);

                userAnswerDto.question = questionDetailsDto.question;
                userAnswerDto.answer = answerDetailsDto.answer;
                questionsAndAnswers.Add(userAnswerDto);
            }

            usersAnswers.surveyID = surveyID;
            usersAnswers.username = user.userName;
            usersAnswers.questionsAndAnswers = questionsAndAnswers;
            return Ok(usersAnswers);

        }
        [HttpPost("submitAnswers/{username}/{surveyID}/{questionID}/{answerID}")]
        public async Task<IActionResult> AddUserAnswer(int surveyID, int questionID, int answerID, string username) {
            var user = await uow.UserRepository.GetUserAsync(username);
            if (user == null) {
                return BadRequest("User not found");
            }

            var userID = user.userID;
            var userAnswer = new SurveyUserAnswer();
            userAnswer.surveyID = surveyID;
            userAnswer.questionID = questionID;
            userAnswer.answerID = answerID;
            userAnswer.userID = userID;
            uow.SurveyRepository.AddUserAnswer(userAnswer);
            await uow.SaveAsync();

            return StatusCode(201);
        }

        // POST api/survey/submitAnswers -- Add user's answers to survey once submitted
        [HttpPost("submitAnswers")]
        [AllowAnonymous]
        public async Task<IActionResult> ProcessUserAnswers(SurveyUserAnswerDto UserAnswerDto)
        {
            foreach (var userAnswer in UserAnswerDto.questionAndAnswerIDs)
            {
                await AddUserAnswer(UserAnswerDto.surveyID, userAnswer.questionID, userAnswer.answerID, UserAnswerDto.username);
            }
            return StatusCode(201);
        }


        // PUT api/survey/update/{id} -- Update Survey information (i.e. title, description, question, answers)
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateSurvey(int id, SurveyDto SurveyDto)
        {
            try {
                if (id != SurveyDto.surveyID) {
                    return BadRequest("Update not allowed");
                }
                var surveyFromDB = await uow.SurveyRepository.FindSurvey(id);
                if (surveyFromDB == null) {
                    return BadRequest("Update not allowed");
                }
                mapper.Map(SurveyDto, surveyFromDB);
                await uow.SaveAsync();
                return StatusCode(200);
            } catch {
                return BadRequest(400);

            }
        }

        // PATCH api/survey/update/{id} -- Update Survey information (i.e. title, description, question, answers)
        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateSurveyPatch(int id, JsonPatchDocument<Survey> surveyToPatch)
        {
            var surveyFromDB = await uow.SurveyRepository.FindSurvey(id);
            surveyToPatch.ApplyTo(surveyFromDB, ModelState);
            await uow.SaveAsync();
            return StatusCode(200);
        }

        // PATCH api/survey/update/{id} -- Update SurveyAssignee information (i.e. title, description, question, answers)
        [HttpPatch("assignee/update/{username}/{surveyID}")]
        public async Task<IActionResult> UpdateSurveyAssigneePatch(int surveyID, string username, JsonPatchDocument<SurveyAssignee> surveyToPatch)
        {
            var user = await uow.UserRepository.GetUserAsync(username);
            if (user == null) {
                return BadRequest("User not found");
            }

            var userID = user.userID;
            var surveyFromDB = await uow.SurveyRepository.FindAssignedSurvey(surveyID, userID);
            surveyToPatch.ApplyTo(surveyFromDB, ModelState);
            await uow.SaveAsync();
            return StatusCode(200);
        }

        // DELETE api/survey/delete/{id} -- Delete Survey
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteSurvey(int id)
        {
            uow.SurveyRepository.DeleteSurvey(id);
            await uow.SaveAsync();
            return Ok(id);
        }

        // POST api/survey/assign/{surveyID}/{userID} -- Assign survey to user
        [HttpPost("assign/{surveyID}/{userName}")]
        [AllowAnonymous]
        public async Task<IActionResult> AssignSurvey(int surveyID, string userName)
        {
            var user = await uow.UserRepository.GetUserAsync(userName);
            if (user == null) {
                return BadRequest("User not found");
            }

            var userID = user.userID;

            var surveyAssignee = new SurveyAssignee();

            surveyAssignee.surveyID = surveyID;
            surveyAssignee.userID = userID;
            uow.SurveyRepository.AssignUser(surveyAssignee);
            await uow.SaveAsync();

            var survey = await uow.SurveyRepository.FindSurvey(surveyID);
            SendEmail(user.email, user.userName, survey.title, surveyID);

            return StatusCode(201);
        }

        // POST api/survey/assign/{surveyID} -- Assign survey to multiple users
        [HttpPost("assign")]
        [AllowAnonymous]
        public async Task<IActionResult> AssignUsersSurvey(SurveyAssignReq surveyAssignReq)
        {
            foreach (var userName in surveyAssignReq.assignees){
                await AssignSurvey(surveyAssignReq.surveyID, userName);
            }

            return StatusCode(201);
        }

        // POST api/survey/remove/{surveyID}/{userID} -- Remove survey from user
        [HttpDelete("unassign/{surveyID}/{userName}")]
        [AllowAnonymous]
        public async Task<IActionResult> RemoveSurvey(int surveyID, string userName)
        {
            var user = await uow.UserRepository.GetUserAsync(userName);
            if (user == null) {
                return BadRequest("User not found");
            }

            var userID = user.userID;

            uow.SurveyRepository.DeleteSurveyAssignee(surveyID, userID);
            await uow.SaveAsync();

            return StatusCode(201);
        }

        // GET api/survey/assignees/{surveyID} -- Get all users assigned to survey
        [HttpGet("assignees/{surveyID}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSurveyAssigneesBySurvey(int surveyID)
        {
            var assignees = await uow.SurveyRepository.GetSurveyAssigneesBySurveyAsync(surveyID);
            return Ok(assignees);
        }

        // GET api/survey/assignees/{surveyID} -- Get all users assigned to survey, with their name
        [HttpGet("assignees/name/{surveyID}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSurveyAssigneesBySurveyWithName(int surveyID)
        {
            var assignees = await uow.SurveyRepository.GetSurveyAssigneesBySurveyAsync(surveyID);
            var users = new List<UserDto>();
            foreach (var assignee in assignees) {
                var user = await uow.UserRepository.GetUserNameAsync(assignee.userID);
                var user2 = mapper.Map<UserDto>(user);
                users.Add(user2);
            }
            return Ok(users);
        }

        // GET api/survey/assignees/user/{userName} -- Get all surveys assigned to user
        [HttpGet("assignees/user/{userName}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSurveysAssignedToUser(string userName)
        {
            var user = await uow.UserRepository.GetUserAsync(userName);
            if (user == null) {
                return BadRequest("User not found");
            }

            var userID = user.userID;

            var assignedSurveys = await uow.SurveyRepository.GetSurveysAssignedToUserAsync(userID);
            var assignedSurveysDto = mapper.Map<IEnumerable<AssignedSurveysDto>>(assignedSurveys);
            foreach (var assignedSurvey in assignedSurveysDto) {
                var completionStatus = await uow.SurveyRepository.GetSurveyAssigneeStatusAsync(userID, assignedSurvey.surveyID);
                assignedSurvey.completionStatus = completionStatus;
            }
            return Ok(assignedSurveysDto);
        }

        // GET api/survey/assignees/{username}/{surveyID} -- Get single survey assigned to user
        [HttpGet("assignees/{username}/{surveyID}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAssignedSurvey(string userName, int surveyID)
        {
            var user = await uow.UserRepository.GetUserAsync(userName);
            if (user == null) {
                return BadRequest("User not found");
            }

            var userID = user.userID;

            var assignedSurvey = await uow.SurveyRepository.FindAssignedSurvey(surveyID, userID);
            var assignedSurveyDto = mapper.Map<SurveyAssigneeDto>(assignedSurvey);
            return Ok(assignedSurveyDto);
        }

        // ---------------------------------------------------------------------------

        // USER FUNCTIONS ----------------------------------------------------------------

        public void SendEmail(string email, string name, string surveyName, int surveyID) {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("eazy5notifications@gmail.com", "kwtzupsywrebmhvy"),
                EnableSsl = true
            };
            var body =@$"<h1>Hello, {name}</h1>
            <h2>Admin has assigned survey '{surveyName}' to you</h2>
            <p>Click the link below to access it:</p>
            <div style='background-color: #ebf0ff; border-width: 2px; border-color: #a0d2f3; border-style: dashed; width: 40%; padding: 25px; text-align: center'>
                <a href='http://localhost:4200/fill-out/{surveyID}'><h3>Complete the survey</h3></a>
            </div>";
            var msg = new MailMessage("eazy5notifications@gmail.com", email, $"Survey '{surveyName}' is available for you", body);
            msg.IsBodyHtml = true;
            smtpClient.Send(msg);
        }
    }
}
