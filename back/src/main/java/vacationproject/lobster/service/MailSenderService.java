package vacationproject.lobster.service;


import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailSenderService implements ApplicationRunner {

    private final JavaMailSender mailSender;
    private String verificationCode;

    @Value("${spring.mail.username}")
    private String from;

    @Override
    public void run(ApplicationArguments args) throws Exception {
    }

    public void run(String receiver, String code) {
        if (receiver != null) {
            try {
                verificationCode = code; // 인증 코드 저장

                MimeMessage m = mailSender.createMimeMessage();
                MimeMessageHelper h = new MimeMessageHelper(m, "UTF-8");
                h.setFrom(from);
                h.setTo(receiver);
                h.setSubject("본인확인 이메일 인증코드");
                h.setText(code);
                mailSender.send(m);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    public void invite(String receiver, String groupLink) {
        if (receiver != null) {
            try {

                MimeMessage m = mailSender.createMimeMessage();
                MimeMessageHelper h = new MimeMessageHelper(m, "UTF-8");
                h.setFrom(from);
                h.setTo(receiver);
                h.setSubject("그룹 초대 메일");
                h.setText(groupLink);
                mailSender.send(m);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }



}
