using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Altinn.Platform.Authorization.Functions.Configuration;
using Altinn.Platform.Authorization.Functions.Models;
using Altinn.Platform.Authorization.Functions.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace Altinn.Platform.Authorization.Functions.Clients
{
    /// <summary>
    /// Client configuration for Bridge API
    /// </summary>
    public class BridgeClient
    {
        private readonly IAccessTokenProvider _accessTokenProvider;
        private const string DelegationEventEndpoint = "delegationevent";
        /// <summary>
        /// Gets an instance of httpclient from httpclientfactory
        /// </summary>
        public HttpClient Client { get; }

        /// <summary>
        /// Initializes the http client for access Bridge API
        /// </summary>
        /// <param name="client">the http client</param>
        /// <param name="platformSettings">the platform settings configured for the authorization functions</param>
        public BridgeClient(HttpClient client, IAccessTokenProvider accessTokenProvider, IOptions<PlatformSettings> platformSettings)
        {
            _accessTokenProvider = accessTokenProvider;
            PlatformSettings settings = platformSettings.Value;
            Client = client;
            Client.BaseAddress = new Uri(settings.BridgeApiEndpoint);
            Client.Timeout = new TimeSpan(0, 0, 30);
            Client.DefaultRequestHeaders.Clear();
            Client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<HttpResponseMessage> PostDelegationEventsAsync(List<PlatformDelegationEvent> delegationEvents)
        {
            JsonContent jsonContent = JsonContent.Create(delegationEvents);
            using var request = new HttpRequestMessage(HttpMethod.Post, DelegationEventEndpoint)
            {
                Content = JsonContent.Create(delegationEvents),
                Headers =
                {
                    Authorization = new AuthenticationHeaderValue("Bearer", await _accessTokenProvider.GetAccessToken())
                }
            };

            return await Client.SendAsync(request);
        }
    }
}