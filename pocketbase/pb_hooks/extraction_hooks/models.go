package extraction_hooks

type BankInformation struct {
	Name          string `json:"bank_name"`
	StatementDate string `json:"statement_date"`
}

type BusinessInformation struct {
	Address string `json:"address"`
	City    string `json:"city"`
	State   string `json:"state"`
	ZipCode string `json:"zip_code"`
	Name    string `json:"company_name"`
}

type DailyBalance struct {
	Balance float64 `json:"balance"`
	Date    string  `json:"date"`
}

type Transaction struct {
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	Description string  `json:"description"`
}

type TransactionType struct {
	ID   string `json:"id"`
	Type string `json:"type"`
}

type TransactionTypeList struct {
	Transactions []TransactionType `json:"transactions"`
}

type UniversalStatement struct {
	Account struct {
		BeginningBalance float64 `json:"beginning_balance"`
		EndingBalance    float64 `json:"ending_balance"`
		Credits          float64 `json:"deposits"`
		Debits           float64 `json:"withdrawals"`
	} `json:"account_summary"`
	Bank         BankInformation     `json:"bank_information"`
	Business     BusinessInformation `json:"business_information"`
	Transactions []Transaction       `json:"transactions"`
}

type ChoiceOneStatement struct {
	Account struct {
		BeginningBalance float64 `json:"beginning_balance"`
		EndingBalance    float64 `json:"ending_balance"`
		Credits          float64 `json:"total_deposits_credits"`
		Debits           float64 `json:"total_checks_debits"`
	} `json:"account_summary"`
	Bank         BankInformation     `json:"bank_information"`
	Business     BusinessInformation `json:"business_information"`
	Transactions []Transaction       `json:"transactions"`
	DailyBalance []DailyBalance      `json:"daily_balance_summary"`
}

type FirstLoyalStatement struct {
	Bank     BankInformation     `json:"bank_information"`
	Business BusinessInformation `json:"business_information"`
	Account  struct {
		BeginningBalance float64 `json:"beginning_balance"`
		EndingBalance    float64 `json:"ending_balance"`
		Credits          float64 `json:"deposits"`
		Debits           float64 `json:"withdrawals"`
	} `json:"account_summary"`
	Deposits []struct {
		Date        string  `json:"date"`
		Deposits    float64 `json:"deposits"`
		Description string  `json:"description"`
	} `json:"deposits"`
	CardActivity []struct {
		Date        string  `json:"date"`
		Withdrawals float64 `json:"withdrawals"`
		Location    string  `json:"location"`
	} `json:"card_activiy"`
	OtherDebits []struct {
		Date        string  `json:"date"`
		Withdrawals float64 `json:"withdrawals"`
		Description string  `json:"description"`
	} `json:"other_debits"`
	Checks []struct {
		Date   string  `json:"date"`
		Amount float64 `json:"amount"`
	} `json:"checks"`
	DailyBalance []DailyBalance `json:"daily_balance_summary"`
}

type WellsFargoStatement struct {
	Bank     BankInformation     `json:"bank_information"`
	Business BusinessInformation `json:"business_information"`
	Account  struct {
		BeginningBalance float64 `json:"beginning_balance"`
		Credits          float64 `json:"deposits"`
		Debits           float64 `json:"withdrawals"`
		EndingBalance    float64 `json:"ending_balance"`
	} `json:"account_summary"`
	TransactionHistory []struct {
		Date               string   `json:"date"`
		Description        string   `json:"description"`
		Credits            *float64 `json:"deposits"`
		Debits             *float64 `json:"withdrawals"`
		EndingDailyBalance *float64 `json:"ending_daily_balance"`
	} `json:"transaction_history"`
}

type ChaseStatement struct {
	Bank     BankInformation     `json:"bank_information"`
	Business BusinessInformation `json:"business_information"`
	Account  struct {
		BeginningBalance      float64 `json:"beginning_balance"`
		EndingBalance         float64 `json:"ending_balance"`
		Credits               float64 `json:"deposits"`
		ChecksPaid            float64 `json:"checks_paid"`
		ATMDebitWithdrawals   float64 `json:"atm_debit_withdrawals"`
		ElectronicWithdrawals float64 `json:"electronic_withdrawals"`
	} `json:"account_summary"`
	Deposits              []Transaction  `json:"deposits"`
	ChecksPaid            []Transaction  `json:"checks_paid"`
	ATMDebitWithdrawals   []Transaction  `json:"atm_debit_withdrawals"`
	ElectronicWithdrawals []Transaction  `json:"electronic_withdrawals"`
	DailyBalance          []DailyBalance `json:"daily_ending_balance"`
}

type BMOStatement struct {
	Bank     BankInformation     `json:"bank_information"`
	Business BusinessInformation `json:"business_information"`
	Account  struct {
		BeginningBalance float64 `json:"beginning_balance"`
		Credits          float64 `json:"deposit_amount"`
		Debits           float64 `json:"withdrawal_amount"`
		EndingBalance    float64 `json:"ending_balance"`
	} `json:"account_summary"`
	Transactions []struct {
		Date        string   `json:"date"`
		Description string   `json:"description"`
		Deposit     *float64 `json:"deposit"`
		Withdrawal  *float64 `json:"withdrawal"`
		Balance     *float64 `json:"balance"`
	} `json:"transactions"`
}

type AscendStatement struct {
	Bank     BankInformation     `json:"bank_information"`
	Business BusinessInformation `json:"business_information"`
	Accounts []struct {
		Title   string `json:"account_title"`
		Account struct {
			BeginningBalance float64 `json:"beginning_balance"`
			Credits          float64 `json:"total_deposits"`
			Debits           float64 `json:"total_withdrawals"`
			EndingBalance    float64 `json:"ending_balance"`
		} `json:"account_summary"`
		ChecksPaid []*struct {
			Amount float64 `json:"amount"`
			Date   string  `json:"date"`
		} `json:"checks_paid"`
		Transactions []struct {
			Date        string   `json:"date"`
			Description string   `json:"description"`
			Deposit     *float64 `json:"deposit"`
			Withdrawal  *float64 `json:"withdrawal"`
			Balance     float64  `json:"balance"`
		} `json:"transactions"`
	} `json:"accounts"`
}
