import org.springframework.boot.gradle.plugin.SpringBootPlugin

plugins {
    id("java")
    id("jacoco")
    id("org.springframework.boot") version "4.1.1"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot 4 is used without io.spring.dependency-management: the BOM is
    // applied as a Gradle platform, which is the idiomatic form on Gradle 9.
    implementation(platform(SpringBootPlugin.BOM_COORDINATES))
    implementation(platform("io.opentelemetry.instrumentation:opentelemetry-instrumentation-bom:2.32.0"))

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("io.opentelemetry.instrumentation:opentelemetry-spring-boot-starter")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.opentelemetry:opentelemetry-sdk-testing")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
    finalizedBy(tasks.jacocoTestReport)
}

// SonarCloud reads the XML report; sonar-project.properties points at this path.
tasks.jacocoTestReport {
    dependsOn(tasks.test)
    reports {
        xml.required = true
        html.required = false
    }
}
