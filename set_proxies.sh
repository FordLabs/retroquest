#!/bin/sh
echo "systemProp.http.proxyHost=$GRADLE_HTTP_PROXY" >> gradle.properties
echo "systemProp.https.proxyHost=$GRADLE_HTTP_PROXY" >> gradle.properties
echo "systemProp.http.proxyPort=$GRADLE_HTTP_PROXY" >> gradle.properties
echo "systemProp.https.proxyPort=$PROXY_PORT" >> gradle.properties
echo "systemProp.http.proxyHost=$PROXY_PORT" >> gradle.properties
echo "systemProp.http.nonProxyHosts=$NO_PROXY_HOSTS" >> gradle.properties
echo "systemProp.https.nonProxyHosts=$NO_PROXY_HOSTS" >> gradle.properties
echo "systemProp.sonar.url=$SONAR_URL" >> gradle.properties
echo "systemProp.sonar.token=$SONAR_TOKEN" >> gradle.properties
echo "    HTTP_PROXY: $HTTP_PROXY" >> $1
echo "    http_proxy: $HTTP_PROXY" >> $1
echo "    HTTPS_PROXY: $HTTPS_PROXY" >> $1
echo "    https_proxy: $HTTPS_PROXY" >> $1
