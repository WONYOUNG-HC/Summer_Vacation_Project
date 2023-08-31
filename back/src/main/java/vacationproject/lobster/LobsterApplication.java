package vacationproject.lobster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
@ComponentScan("vacationproject.lobster")
public class LobsterApplication {
	public static void main(String[] args) {
		SpringApplication.run(LobsterApplication.class, args);
	}
}
