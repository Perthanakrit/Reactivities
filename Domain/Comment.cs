using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Comment
    {
        public int Id { get; set; } // primary key
        public string Body { get; set; }
        public AppUser Author { get; set; } // navigation property
        public Activity Activity { get; set; } // navigation property
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}