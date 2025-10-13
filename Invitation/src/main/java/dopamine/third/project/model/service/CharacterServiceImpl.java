package dopamine.third.project.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dopamine.third.project.model.dao.CharacterDAO;
import dopamine.third.project.model.dto.Characters;

@Service
public class CharacterServiceImpl implements CharacterService{

	@Autowired
	private CharacterDAO dao;
	
	@Override
	public List<Characters> characterList() {
		return dao.characterList();
	}

	
	
}
