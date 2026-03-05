using System.ComponentModel.DataAnnotations;

namespace ResidencialBills.Models
{
    public class Person
    {
        public int Id { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        public string Age { get; set; }
    }
}
