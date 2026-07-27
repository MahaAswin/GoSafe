package com.gosafe.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class GosafeBackendApplication {

	public static void main(String[] args) {
		loadEnv();
		SpringApplication.run(GosafeBackendApplication.class, args);
	}

	private static void loadEnv() {
		try {
			if (Files.exists(Paths.get(".env"))) {
				List<String> lines = Files.readAllLines(Paths.get(".env"));
				for (String line : lines) {
					line = line.trim();
					if (line.isEmpty() || line.startsWith("#")) {
						continue;
					}
					int separator = line.indexOf('=');
					if (separator > 0) {
						String key = line.substring(0, separator).trim();
						String value = line.substring(separator + 1).trim();
						// Only set if not already set by system environment (production)
						if (System.getenv(key) == null && System.getProperty(key) == null) {
							System.setProperty(key, value);
						}
					}
				}
			}
		} catch (IOException e) {
			System.err.println("Warning: Could not read .env file: " + e.getMessage());
		}
	}
}
