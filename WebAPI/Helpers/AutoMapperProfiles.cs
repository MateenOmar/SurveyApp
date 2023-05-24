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
        }
    }
}