using Application.Profiles;
using Domain;

namespace Application.Activities
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public string HostUsername { get; set; } // This is the data we want to send to the API
        public bool IsCancelled { get; set; }
        public ICollection<Profile> Attendees { get; set; }
    }
}