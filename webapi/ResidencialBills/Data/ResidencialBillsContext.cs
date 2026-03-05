using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResidencialBills.Models;

namespace ResidencialBills.Data
{
    public class ResidencialBillsContext : DbContext
    {
        public ResidencialBillsContext (DbContextOptions<ResidencialBillsContext> options)
            : base(options)
        {
        }

        public DbSet<ResidencialBills.Models.Person> Person { get; set; } = default!;
        public DbSet<ResidencialBills.Models.Category> Category { get; set; } = default!;
        public DbSet<ResidencialBills.Models.Transaction> Transaction { get; set; } = default!;
    }
}
