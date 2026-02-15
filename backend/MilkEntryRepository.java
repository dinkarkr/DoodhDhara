
package backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MilkEntryRepository extends JpaRepository<MilkEntry, String> {
    List<MilkEntry> findAllByOrderByDateDesc();
}
