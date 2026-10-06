import com.diffplug.gradle.spotless.SpotlessExtension

plugins {
    id("com.diffplug.spotless") version "8.10.3" apply false
}

subprojects {
    // Only the leaf service modules carry Java. `:services` is a grouping
    // project with no sources, and Spotless cannot configure a Java task there.
    plugins.withId("java") {
        apply(plugin = "com.diffplug.spotless")
        apply(plugin = "checkstyle")

        configure<SpotlessExtension> {
            java {
                // No explicit google-java-format version: Spotless 8.10.3 calls
                // the formatter reflectively, and pinning 1.37.0 here fails with
                // InvocationTargetException on every file. The plugin version is
                // pinned above, so the formatter version is still deterministic.
                googleJavaFormat().aosp()
                removeUnusedImports()
                trimTrailingWhitespace()
                endWithNewline()
            }
        }

        configure<CheckstyleExtension> {
            toolVersion = "14.3.0"
            configFile = rootProject.file("config/checkstyle/checkstyle.xml")
        }
    }
}
