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

        // Spring Boot 4.1.1 manages Tomcat 11.0.24, which carries three critical
        // advisories: GHSA-gcx9-497g-6cp6, GHSA-9xv2-5v5q-p794, and
        // GHSA-h3x4-894j-xpx5. All three are fixed in 11.0.25; 11.0.26 is the
        // latest patched release. `dependency-review` runs with
        // `fail-on-severity: high`, so this is a gate failure, not a warning.
        //
        // The Boot BOM is applied as a Gradle platform rather than through
        // io.spring.dependency-management, so the `tomcat.version` property
        // override does not apply. A constraint is the equivalent: Gradle
        // resolves the highest of the platform's constraint and this one.
        // All three embed artifacts move together to keep them at one version.
        // Remove this block once the managed Boot version is 11.0.25 or later.
        dependencies {
            constraints {
                listOf(
                    "tomcat-embed-core",
                    "tomcat-embed-el",
                    "tomcat-embed-websocket",
                ).forEach { artifact ->
                    add("implementation", "org.apache.tomcat.embed:$artifact:11.0.26")
                }
            }
        }
    }
}
