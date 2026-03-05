using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ResidencialBills.Data;

// Carrega as variáveis do arquivo .env
DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Constroi a connection string usando variáveis de ambiente
var connectionString = $"Host={builder.Configuration["DB_HOST"]};" +
                      $"Port={builder.Configuration["DB_PORT"]};" +
                      $"Username={builder.Configuration["DB_USERNAME"]};" +
                      $"Password={builder.Configuration["DB_PASSWORD"]};" +
                      $"Database={builder.Configuration["DB_DATABASE"]}";

builder.Services.AddDbContext<ResidencialBillsContext>(options =>
    options.UseNpgsql(connectionString));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontDev", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("FrontDev");

app.MapControllers();

app.Run();