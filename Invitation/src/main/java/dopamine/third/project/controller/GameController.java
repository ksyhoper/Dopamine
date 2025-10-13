package dopamine.third.project.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
@RequestMapping("/game")
public class GameController {
    
    /**
     * 깜깜한 방 페이지
     */
    @GetMapping("/blackRoom")
    public String blackRoom(HttpSession session, Model model) {
        
        // 세션에서 선택된 캐릭터 정보 가져오기
        Map<String, Object> selectedCharacter = (Map<String, Object>) session.getAttribute("selectedCharacter");
        
        // 캐릭터가 선택되지 않았으면 캐릭터 선택 페이지로 리다이렉트
        if (selectedCharacter == null) {
            return "redirect:/character/select";
        }
        
        // 선택된 캐릭터 정보를 모델에 추가
        model.addAttribute("character", selectedCharacter);
        
        // 로그 출력
        System.out.println("깜깜한 방 입장 - 캐릭터: " + selectedCharacter.get("name"));
        
        return "game/blackRoom"; // JSP 파일 경로
    }
    
    /**
     * 게임 초기화 (세션 클리어)
     */
    @GetMapping("/reset")
    public String resetGame(HttpSession session) {
        session.invalidate(); // 세션 전체 초기화
        return "redirect:/character/select";
    }
}