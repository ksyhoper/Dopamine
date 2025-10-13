package dopamine.third.project.model.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import dopamine.third.project.model.dto.Characters;

@Repository
public class CharacterDAO {
	
	@Autowired
	private SqlSessionTemplate sqlSession;

	public List<Characters> characterList() {
		List<Characters> list = sqlSession.selectList("characterMapper.characterList");
		return list;
	}
}
