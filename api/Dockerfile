FROM openjdk:8-jre-alpine
COPY /build/libs/fordfacto-web-0.0.1-SNAPSHOT.jar /opt/retroquest/lib/
ENTRYPOINT ["/usr/bin/java"]
CMD ["-jar", "/opt/retroquest/lib/fordfacto-web-0.0.1-SNAPSHOT.jar"]
VOLUME /var/lib/retroquest/repo
EXPOSE 8080