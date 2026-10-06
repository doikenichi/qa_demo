import com.diffplug.gradle.spotless.SpotlessExtension

plugins {
    id("com.diffplug.spotless") version "7.0.2" apply false
}

subprojects {
    apply(plugin = "com.diffplug.spotless")
    apply(plugin = "checkstyle")

    configure<SpotlessExtension> {
        java {
            googleJavaFormat("1.25.2").aosp()
            removeUnusedImports()
            trimTrailingWhitespace()
        }
    }

    configure<CheckstyleExtension> {
        toolVersion = "10.21.0"
        configFile = rootProject.file("config/checkstyle/checkstyle.xml")
    }
}
