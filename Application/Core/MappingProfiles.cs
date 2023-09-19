using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName)); // Map HostUsername from Attendees where IsHost is true 
            CreateMap<ActivityAttendee, Proflies.Proflie>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName)) // Map DisplayName from AppUse
                    .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName)) // Map Username from AppUser 
                        .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio)); // Map Bio from AppUser
        }
    }
}