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
    [Authorize]
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

        // GET api/survey -- Get all surveys
        [HttpGet("surveys")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSurveys(string type)
        {
            var surveys = await uow.SurveyRepository.GetSurveysAsync(type);
            var SurveyDto = mapper.Map<IEnumerable<SurveyDto>>(surveys);
            return Ok(SurveyDto);
        }

        [HttpGet("surveys/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSurvey(int id)
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

            surveyCompleteDto.questions = jsonQuestionsList;

            return Ok(surveyCompleteDto);
        }

        // POST api/survey/post -- Post data in JSON format
        [HttpPost("post")]
        public async Task<IActionResult> AddSurvey(SurveyDto SurveyDto)
        {
            var survey = mapper.Map<Survey>(SurveyDto);
            uow.SurveyRepository.AddSurvey(survey);
            await uow.SaveAsync();
            return StatusCode(201);
        }

        // POST api/survey/questions/options/{surveyID}/{questionID}/submit -- Add user's answers to survey once submitted
        [HttpPost("questions/options/{surveyID}/{questionID}/submit")]
        [AllowAnonymous]
        public async Task<IActionResult> AddUserAnswers(SurveyUserAnswerDto[] UserAnswerDto)
        {
            foreach (var userAnswer in UserAnswerDto)
            {
                var answer = mapper.Map<SurveyUserAnswer>(userAnswer);
                uow.SurveyRepository.AddUserAnswer(answer);
            }
            await uow.SaveAsync();
            return StatusCode(201);
        }

        // PUT api/survey/update/{id} -- Update Survey information (i.e. title, description, question, answers)
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateSurvey(int surveyID, SurveyDto SurveyDto)
        {
            try {
                if (surveyID != SurveyDto.surveyID) {
                    return BadRequest("Update not allowed");
                }
                var surveyFromDB = await uow.SurveyRepository.FindSurvey(surveyID);
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

        // DELETE api/survey/post -- Delete Survey
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteSurvey(int id)
        {
            uow.SurveyRepository.DeleteSurvey(id);
            await uow.SaveAsync();
            return Ok(id);
        }

        // Save survey as draft
        // TO BE IMPLEMENTED

        // ---------------------------------------------------------------------------

        // USER FUNCTIONS ----------------------------------------------------------------

        // POST api/survey/submit
        [HttpPost("submit")]
        [Authorize]
        public async Task<IActionResult> SubmitAnswer(SurveyDto surveyDto)
        {
            
            
            return StatusCode(201);
        }
    }
}