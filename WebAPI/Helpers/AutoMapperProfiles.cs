using AutoMapper;
using WebAPI.Dtos;
using WebAPI.Models;

namespace WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Survey, SurveyDto>().ReverseMap();

            CreateMap<SurveyQuestion, SurveyQuestionDto>().ReverseMap();

            CreateMap<SurveyOption, SurveyOptionDto>().ReverseMap();

            CreateMap<User, UserDto>().ReverseMap();

            CreateMap<Survey, SurveyCompleteDto>().ReverseMap();

            CreateMap<Survey, AssignedSurveysDto>().ReverseMap();

            CreateMap<SurveyAssignee, SurveyAssigneeDto>().ReverseMap();
            
            CreateMap<SurveyUserAnswer, SurveyUserAnswerDto>().ReverseMap();
        }
    }
}