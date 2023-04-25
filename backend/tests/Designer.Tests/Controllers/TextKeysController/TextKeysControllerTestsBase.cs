﻿using System;
using Altinn.Studio.Designer.Configuration;
using Altinn.Studio.Designer.Services.Interfaces;
using Designer.Tests.Controllers.ApiTests;
using Designer.Tests.Mocks;
using Designer.Tests.Utils;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace Designer.Tests.Controllers.TextKeysController
{
    public class TextKeysControllerTestsBase<TControllerTestType> : ApiTestsBase<Altinn.Studio.Designer.Controllers.TextKeysController, TControllerTestType>, IDisposable
        where TControllerTestType : class
    {
        protected static string VersionPrefix(string org, string repository) => $"/designer/api/{org}/{repository}/text-keys";
        protected string CreatedFolderPath { get; set; }

        public void Dispose()
        {
            if (!string.IsNullOrWhiteSpace(CreatedFolderPath))
            {
                TestDataHelper.DeleteDirectory(CreatedFolderPath);
            }
        }

        public TextKeysControllerTestsBase(WebApplicationFactory<Altinn.Studio.Designer.Controllers.TextKeysController> factory) : base(factory)
        {
        }

        protected override void ConfigureTestServices(IServiceCollection services)
        {
            services.Configure<ServiceRepositorySettings>(c =>
                c.RepositoryLocation = TestRepositoriesLocation);
            services.AddSingleton<IGitea, IGiteaMock>();
        }
    }
}