using System.ComponentModel.DataAnnotations;

namespace ResidencialBills.Models
{
    public class Transaction
    {
        public int Id { get; set; }

        [MaxLength(400)]
        public string Description { get; set; } = string.Empty;

        public decimal _value;
        public decimal Value { 
            get => _value;
            set => _value = Math.Round(value, 2, MidpointRounding.AwayFromZero);
        }

        public string Type { get; set; } = string.Empty;

        // Foreign Keys
        public int CategoryId { get; set; }
        public int PersonId { get; set; }

        // Navigation properties are optional in request payloads.
        public Category? Category { get; set; }
        public Person? Person { get; set; }
    }
}
