
package backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/milk")
@CrossOrigin(origins = "*")
public class MilkController {

    @Autowired
    private MilkEntryRepository repository;

    @GetMapping("/entries")
    public List<MilkEntry> getAllEntries() {
        return repository.findAllByOrderByDateDesc();
    }

    @PostMapping("/entries")
    public MilkEntry createEntry(@RequestBody MilkEntry entry) {
        // Indian Standard Calculation Logic on Backend for Security
        double snf = (entry.getClr() / 4) + (entry.getFat() * 0.2) + 0.7;
        entry.setSnf(Math.round(snf * 100.0) / 100.0);
        
        // Final Amount Calculation
        entry.setAmount(Math.round(entry.getQuantity() * entry.getRate() * 100.0) / 100.0);
        
        return repository.save(entry);
    }

    @DeleteMapping("/entries/{id}")
    public void deleteEntry(@PathVariable String id) {
        repository.deleteById(id);
    }
}
