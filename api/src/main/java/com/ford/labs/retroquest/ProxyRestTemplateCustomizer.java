/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ford.labs.retroquest;

import org.apache.http.HttpException;
import org.apache.http.HttpHost;
import org.apache.http.HttpRequest;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.DefaultProxyRoutePlanner;
import org.apache.http.protocol.HttpContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateCustomizer;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ProxyRestTemplateCustomizer implements RestTemplateCustomizer {

    @Value("${http.proxy:}")
    private String httpProxy;

    @Override
    public void customize(RestTemplate restTemplate) {
        if (httpProxy.isEmpty()) {
            return;
        }

        var proxyHost = HttpHost.create(httpProxy);
        var proxyClient = HttpClientBuilder.create()
            .setRoutePlanner(new DefaultProxyRoutePlanner(proxyHost) {
                @Override
                public HttpHost determineProxy(HttpHost target, HttpRequest request,
                                               HttpContext context) throws HttpException {
                    if (target.getHostName().equals("localhost")) {
                        return null;
                    }
                    return super.determineProxy(target, request, context);
                }
            }).build();

        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory(proxyClient));

    }
}
