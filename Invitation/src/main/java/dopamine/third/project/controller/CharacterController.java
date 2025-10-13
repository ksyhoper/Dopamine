package dopamine.third.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import dopamine.third.project.model.dto.Characters;
import dopamine.third.project.model.service.CharacterService;

@Controller
public class CharacterController {

	@Autowired
	private CharacterService service;
	
	@RequestMapping("/")
	public String mainForward(Model model) {
		return "forward:/character/list";
	}
	
	@RequestMapping("/character/list")
	public String CharacterList(Model model){
		List<Characters> characterList = service.characterList();
		model.addAttribute("characterList", characterList);
		return "Character";
	}

	 /**
     * 캐릭터 선택 처리 (AJAX)
     */
    @PostMapping("/character/select")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> selectCharacter(
            @RequestParam("characterName") String characterName,
            @RequestParam("alias") String alias,
            @RequestParam("birthday") String birthday,
            @RequestParam("description") String description,
            @RequestParam(value = "authority", required = false) String authority,
            @RequestParam("picture") String picture,
            HttpSession session) { 
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 선택된 캐릭터 정보를 세션에 저장
            Map<String, Object> selectedCharacter = new HashMap<>();
            selectedCharacter.put("name", characterName);
            selectedCharacter.put("alias", alias);
            selectedCharacter.put("birthday", birthday);
            selectedCharacter.put("description", description);
            selectedCharacter.put("authority", authority);
            selectedCharacter.put("picture", picture);
            
            session.setAttribute("selectedCharacter", selectedCharacter);
            
            // 로그 출력
            System.out.println("캐릭터 선택됨: " + characterName);
            System.out.println("별명: " + alias);
            System.out.println("생년월일: " + birthday);
            System.out.println("설명: " + description);
            System.out.println("권한: " + authority);
            System.out.println("사진: " + picture);
            
            // 성공 응답
            response.put("success", true);
            response.put("message", "캐릭터가 성공적으로 선택되었습니다.");
            response.put("selectedCharacter", selectedCharacter);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            // 오류 응답
            System.err.println("캐릭터 선택 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "캐릭터 선택 중 오류가 발생했습니다.");
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }
}
