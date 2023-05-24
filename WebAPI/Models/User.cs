using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class User
    {
        public int UserID { get; set; } 

        [Required]
        public string userName { get; set; }

        [Required]
        public byte[] password { get; set; }

        [Required]
        public string firstName { get; set; }

        [Required]
        public string lastName { get; set; }

        [Required]
        public string email { get; set; }

        [Required]
        public byte[] passwordKey { get; set; }
        
        public bool admin { get; set; } = false;
        
    }
}