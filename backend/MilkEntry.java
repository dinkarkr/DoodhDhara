
package backend;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "milk_entries")
public class MilkEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private LocalDate date;
    private String partyId;
    private String type; // PURCHASE or SALE
    private Double quantity;
    private Double fat;
    private Double clr;
    private Double snf;
    private Double rate;
    private Double amount;
    private String status;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getPartyId() { return partyId; }
    public void setPartyId(String partyId) { this.partyId = partyId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public Double getFat() { return fat; }
    public void setFat(Double fat) { this.fat = fat; }
    public Double getClr() { return clr; }
    public void setClr(Double clr) { this.clr = clr; }
    public Double getSnf() { return snf; }
    public void setSnf(Double snf) { this.snf = snf; }
    public Double getRate() { return rate; }
    public void setRate(Double rate) { this.rate = rate; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
