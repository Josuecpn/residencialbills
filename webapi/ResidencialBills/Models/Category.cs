using System.ComponentModel.DataAnnotations;

namespace ResidencialBills.Models
{
    public class Category
    {
        public int Id { get; set; }

        [MaxLength(400)]
        public string Description { get; set; }

        public string Purpose { get; set; }
    }
}
