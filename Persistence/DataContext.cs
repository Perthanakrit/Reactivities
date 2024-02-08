using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.ActivityId })); // Composite key for ActivityAttendee 

            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.AppUser) // ActivityAttendee has one AppUser
                .WithMany(a => a.Activities) // AppUser has many Activities
                .HasForeignKey(aa => aa.AppUserId); // Foreign key for AppUser

            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.Activity) // ActivityAttendee has one Activity
                .WithMany(a => a.Attendees) // Activity has many Attendees
                .HasForeignKey(aa => aa.ActivityId); // Foreign key for Activity

            builder.Entity<Comment>()
                .HasOne(a => a.Activity)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade); // Delete all comments when an activity is deleted
        }
    }
}