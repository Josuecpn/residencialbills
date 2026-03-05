using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResidencialBills.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFieldsToTransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Transaction",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Value",
                table: "Transaction",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "Transaction");
        }
    }
}
