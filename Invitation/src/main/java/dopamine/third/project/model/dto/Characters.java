package dopamine.third.project.model.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Characters {
	private int no;
	private String name;
	private String alias;
	private String birthday;
	private String description;
	private String delFlag;
	private int authority;
	private String picture;
}
