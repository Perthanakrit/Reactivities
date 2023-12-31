using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Photos
{
    public class PhotoUploadResult
    {
        public string PublicId { get; set; } // PublicId is the id of the photo in Cloudinary
        public string Url { get; set; }
    }
}