/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	AvgDailyRevenue = "avg_daily_revenue",
	AvgMonthlyRevenue = "avg_monthly_revenue",
	AvgWeeklyRevenue = "avg_weekly_revenue",
	BalanceOverTime = "balance_over_time",
	ChecksPaid = "checks_paid",
	ChecksVsDebits = "checks_vs_debits",
	DailyBalance = "daily_balance",
	Deals = "deals",
	EndingBalanceOverTime = "ending_balance_over_time",
	Extractions = "extractions",
	FinanceFreq = "finance_freq",
	FinancingAsPercentIncome = "financing_as_percent_income",
	FinancingDetails = "financing_details",
	FirstFinancing = "first_financing",
	FundingAsPercentageOfRevenue = "funding_as_percentage_of_revenue",
	FundingVsRevenue = "funding_vs_revenue",
	Jobs = "jobs",
	Organizations = "organizations",
	PaymentsVsIncome = "payments_vs_income",
	RealRevenueByDeal = "real_revenue_by_deal",
	StatementDetails = "statement_details",
	Statements = "statements",
	TotalBankFees = "total_bank_fees",
	TotalFinanceing = "total_financeing",
	TotalInterest = "total_interest",
	Transactions = "transactions",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type AvgDailyRevenueRecord<TdailyRevenue = unknown, Tday = unknown> = {
	dailyRevenue?: null | TdailyRevenue
	day?: null | Tday
	deal: RecordIdString
	id: string
}

export type AvgMonthlyRevenueRecord<Taverage_monthly_revenue = unknown, Tdeal = unknown> = {
	average_monthly_revenue?: null | Taverage_monthly_revenue
	deal?: null | Tdeal
	id: string
}

export type AvgWeeklyRevenueRecord<TaverageWeeklyRevenue = unknown, Tdeal = unknown, Tweek = unknown> = {
	averageWeeklyRevenue?: null | TaverageWeeklyRevenue
	deal?: null | Tdeal
	id: string
	week?: null | Tweek
}

export type BalanceOverTimeRecord<Tdeal = unknown> = {
	beginning_balance?: number
	date?: IsoDateString
	deal?: null | Tdeal
	id: string
}

export type ChecksPaidRecord = {
	amount: number
	check_number?: number
	created?: IsoDateString
	date?: IsoDateString
	deal: RecordIdString
	id: string
	reference?: number
	statement: RecordIdString
	updated?: IsoDateString
}

export type ChecksVsDebitsRecord<Tdeal = unknown, TtotalChecksAmount = unknown> = {
	date?: IsoDateString
	deal?: null | Tdeal
	id: string
	statement?: RecordIdString
	totalChecksAmount?: null | TtotalChecksAmount
	total_checks_debits?: number
}

export type DailyBalanceRecord = {
	balance: number
	created?: IsoDateString
	date: IsoDateString
	deal: RecordIdString
	id: string
	statement: RecordIdString
	updated?: IsoDateString
}

export type DealsRecord = {
	address?: string
	bank?: string
	created?: IsoDateString
	credit_score?: number
	founded?: IsoDateString
	id: string
	industry?: string
	merchant?: string
	organization?: RecordIdString
	state?: string
	updated?: IsoDateString
	user: RecordIdString
	zip_code?: string
}

export type EndingBalanceOverTimeRecord<Tdeal = unknown> = {
	date?: IsoDateString
	deal?: null | Tdeal
	ending_balance?: number
	id: string
}

export type ExtractionsRecord<Tdata = unknown> = {
	created?: IsoDateString
	data?: null | Tdata
	file: string
	id: string
	job: RecordIdString
	statement?: RecordIdString
	updated?: IsoDateString
}

export type FinanceFreqRecord<Tmonth = unknown> = {
	deal: RecordIdString
	financingPaymentsCount?: number
	id: string
	month?: null | Tmonth
}

export type FinancingAsPercentIncomeRecord<Tmonth = unknown, TmonthlyFinancingAsPercentageOfIncome = unknown> = {
	deal: RecordIdString
	id: string
	month?: null | Tmonth
	monthlyFinancingAsPercentageOfIncome?: null | TmonthlyFinancingAsPercentageOfIncome
}

export type FinancingDetailsRecord<Tfirst_financing_date = unknown, Ttotal_financing = unknown> = {
	deal: RecordIdString
	financing_frequency?: number
	first_financing_date?: null | Tfirst_financing_date
	id: string
	total_financing?: null | Ttotal_financing
}

export type FirstFinancingRecord<TfirstFinancingDate = unknown> = {
	deal: RecordIdString
	firstFinancingDate?: null | TfirstFinancingDate
	id: string
}

export type FundingAsPercentageOfRevenueRecord<Tdeal = unknown, TfundingAsPercentageOfRevenue = unknown, Ttotal_financing = unknown, Ttotal_revenue = unknown> = {
	deal?: null | Tdeal
	fundingAsPercentageOfRevenue?: null | TfundingAsPercentageOfRevenue
	id: string
	total_financing?: null | Ttotal_financing
	total_revenue?: null | Ttotal_revenue
}

export type FundingVsRevenueRecord<Tfunding_to_revenue_ratio = unknown, Treal_revenue = unknown, Ttotal_funding = unknown> = {
	deal: RecordIdString
	funding_to_revenue_ratio?: null | Tfunding_to_revenue_ratio
	id: string
	real_revenue?: null | Treal_revenue
	total_funding?: null | Ttotal_funding
}

export enum JobsStatusOptions {
	"PENDING" = "PENDING",
	"SUCCESS" = "SUCCESS",
	"ERROR" = "ERROR",
	"PARTIAL_SUCCESS" = "PARTIAL_SUCCESS",
	"CANCELLED" = "CANCELLED",
}
export type JobsRecord<Tmetadata = unknown> = {
	agent_id: string
	completed?: IsoDateString
	created?: IsoDateString
	deal: RecordIdString
	document_tokens?: number
	extraction?: RecordIdString
	id: string
	job_id: string
	metadata?: null | Tmetadata
	num_pages?: number
	output_tokens?: number
	run_id?: string
	statement: RecordIdString
	status: JobsStatusOptions
	updated?: IsoDateString
}

export type OrganizationsRecord = {
	address?: string
	created?: IsoDateString
	email?: string
	id: string
	logo?: string
	name?: string
	phone?: number
	updated?: IsoDateString
	website?: string
}

export type PaymentsVsIncomeRecord<Tavg_monthly_income = unknown, Tavg_monthly_payment = unknown, Tdeal = unknown, Tpayment_to_income_percentage = unknown> = {
	avg_monthly_income?: null | Tavg_monthly_income
	avg_monthly_payment?: null | Tavg_monthly_payment
	deal?: null | Tdeal
	id: string
	payment_to_income_percentage?: null | Tpayment_to_income_percentage
}

export type RealRevenueByDealRecord<Tdeal = unknown, TrealRevenue = unknown> = {
	deal?: null | Tdeal
	id: string
	realRevenue?: null | TrealRevenue
}

export type StatementDetailsRecord = {
	beginning_balance?: number
	created?: IsoDateString
	date?: IsoDateString
	days_in_period?: number
	deal?: RecordIdString
	ending_balance?: number
	id: string
	interest_paid?: number
	service_charge?: number
	statement?: RecordIdString
	total_checks_debits?: number
	total_deposits_credits?: number
	total_overdraft_fee?: number
	total_returned_item_fees?: number
	updated?: IsoDateString
}

export type StatementsRecord = {
	created?: IsoDateString
	deal: RecordIdString
	file: string
	filename: string
	id: string
	llama_index_file_id?: string
	updated?: IsoDateString
}

export type TotalBankFeesRecord<Tdeal = unknown, TtotalBankFees = unknown, TtotalOverdraftFees = unknown, TtotalReturnedItemFees = unknown, TtotalServiceCharges = unknown> = {
	deal?: null | Tdeal
	id: string
	totalBankFees?: null | TtotalBankFees
	totalOverdraftFees?: null | TtotalOverdraftFees
	totalReturnedItemFees?: null | TtotalReturnedItemFees
	totalServiceCharges?: null | TtotalServiceCharges
}

export type TotalFinanceingRecord<TtotalFinancingAmount = unknown> = {
	deal: RecordIdString
	id: string
	totalFinancingAmount?: null | TtotalFinancingAmount
}

export type TotalInterestRecord<Tmonth = unknown, TtotalInterestPaid = unknown> = {
	id: string
	month?: null | Tmonth
	totalInterestPaid?: null | TtotalInterestPaid
}

export enum TransactionsTypeOptions {
	"revenue" = "revenue",
	"transfer" = "transfer",
	"financing" = "financing",
}
export type TransactionsRecord = {
	amount?: number
	created?: IsoDateString
	date?: IsoDateString
	deal: RecordIdString
	description?: string
	id: string
	statement: RecordIdString
	trace_number?: number
	type?: TransactionsTypeOptions
	updated?: IsoDateString
}

export enum UsersRoleOptions {
	"admin" = "admin",
	"agent" = "agent",
}
export type UsersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	organization?: RecordIdString
	password: string
	role?: UsersRoleOptions
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AvgDailyRevenueResponse<TdailyRevenue = unknown, Tday = unknown, Texpand = unknown> = Required<AvgDailyRevenueRecord<TdailyRevenue, Tday>> & BaseSystemFields<Texpand>
export type AvgMonthlyRevenueResponse<Taverage_monthly_revenue = unknown, Tdeal = unknown, Texpand = unknown> = Required<AvgMonthlyRevenueRecord<Taverage_monthly_revenue, Tdeal>> & BaseSystemFields<Texpand>
export type AvgWeeklyRevenueResponse<TaverageWeeklyRevenue = unknown, Tdeal = unknown, Tweek = unknown, Texpand = unknown> = Required<AvgWeeklyRevenueRecord<TaverageWeeklyRevenue, Tdeal, Tweek>> & BaseSystemFields<Texpand>
export type BalanceOverTimeResponse<Tdeal = unknown, Texpand = unknown> = Required<BalanceOverTimeRecord<Tdeal>> & BaseSystemFields<Texpand>
export type ChecksPaidResponse<Texpand = unknown> = Required<ChecksPaidRecord> & BaseSystemFields<Texpand>
export type ChecksVsDebitsResponse<Tdeal = unknown, TtotalChecksAmount = unknown, Texpand = unknown> = Required<ChecksVsDebitsRecord<Tdeal, TtotalChecksAmount>> & BaseSystemFields<Texpand>
export type DailyBalanceResponse<Texpand = unknown> = Required<DailyBalanceRecord> & BaseSystemFields<Texpand>
export type DealsResponse<Texpand = unknown> = Required<DealsRecord> & BaseSystemFields<Texpand>
export type EndingBalanceOverTimeResponse<Tdeal = unknown, Texpand = unknown> = Required<EndingBalanceOverTimeRecord<Tdeal>> & BaseSystemFields<Texpand>
export type ExtractionsResponse<Tdata = unknown, Texpand = unknown> = Required<ExtractionsRecord<Tdata>> & BaseSystemFields<Texpand>
export type FinanceFreqResponse<Tmonth = unknown, Texpand = unknown> = Required<FinanceFreqRecord<Tmonth>> & BaseSystemFields<Texpand>
export type FinancingAsPercentIncomeResponse<Tmonth = unknown, TmonthlyFinancingAsPercentageOfIncome = unknown, Texpand = unknown> = Required<FinancingAsPercentIncomeRecord<Tmonth, TmonthlyFinancingAsPercentageOfIncome>> & BaseSystemFields<Texpand>
export type FinancingDetailsResponse<Tfirst_financing_date = unknown, Ttotal_financing = unknown, Texpand = unknown> = Required<FinancingDetailsRecord<Tfirst_financing_date, Ttotal_financing>> & BaseSystemFields<Texpand>
export type FirstFinancingResponse<TfirstFinancingDate = unknown, Texpand = unknown> = Required<FirstFinancingRecord<TfirstFinancingDate>> & BaseSystemFields<Texpand>
export type FundingAsPercentageOfRevenueResponse<Tdeal = unknown, TfundingAsPercentageOfRevenue = unknown, Ttotal_financing = unknown, Ttotal_revenue = unknown, Texpand = unknown> = Required<FundingAsPercentageOfRevenueRecord<Tdeal, TfundingAsPercentageOfRevenue, Ttotal_financing, Ttotal_revenue>> & BaseSystemFields<Texpand>
export type FundingVsRevenueResponse<Tfunding_to_revenue_ratio = unknown, Treal_revenue = unknown, Ttotal_funding = unknown, Texpand = unknown> = Required<FundingVsRevenueRecord<Tfunding_to_revenue_ratio, Treal_revenue, Ttotal_funding>> & BaseSystemFields<Texpand>
export type JobsResponse<Tmetadata = unknown, Texpand = unknown> = Required<JobsRecord<Tmetadata>> & BaseSystemFields<Texpand>
export type OrganizationsResponse<Texpand = unknown> = Required<OrganizationsRecord> & BaseSystemFields<Texpand>
export type PaymentsVsIncomeResponse<Tavg_monthly_income = unknown, Tavg_monthly_payment = unknown, Tdeal = unknown, Tpayment_to_income_percentage = unknown, Texpand = unknown> = Required<PaymentsVsIncomeRecord<Tavg_monthly_income, Tavg_monthly_payment, Tdeal, Tpayment_to_income_percentage>> & BaseSystemFields<Texpand>
export type RealRevenueByDealResponse<Tdeal = unknown, TrealRevenue = unknown, Texpand = unknown> = Required<RealRevenueByDealRecord<Tdeal, TrealRevenue>> & BaseSystemFields<Texpand>
export type StatementDetailsResponse<Texpand = unknown> = Required<StatementDetailsRecord> & BaseSystemFields<Texpand>
export type StatementsResponse<Texpand = unknown> = Required<StatementsRecord> & BaseSystemFields<Texpand>
export type TotalBankFeesResponse<Tdeal = unknown, TtotalBankFees = unknown, TtotalOverdraftFees = unknown, TtotalReturnedItemFees = unknown, TtotalServiceCharges = unknown, Texpand = unknown> = Required<TotalBankFeesRecord<Tdeal, TtotalBankFees, TtotalOverdraftFees, TtotalReturnedItemFees, TtotalServiceCharges>> & BaseSystemFields<Texpand>
export type TotalFinanceingResponse<TtotalFinancingAmount = unknown, Texpand = unknown> = Required<TotalFinanceingRecord<TtotalFinancingAmount>> & BaseSystemFields<Texpand>
export type TotalInterestResponse<Tmonth = unknown, TtotalInterestPaid = unknown, Texpand = unknown> = Required<TotalInterestRecord<Tmonth, TtotalInterestPaid>> & BaseSystemFields<Texpand>
export type TransactionsResponse<Texpand = unknown> = Required<TransactionsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	avg_daily_revenue: AvgDailyRevenueRecord
	avg_monthly_revenue: AvgMonthlyRevenueRecord
	avg_weekly_revenue: AvgWeeklyRevenueRecord
	balance_over_time: BalanceOverTimeRecord
	checks_paid: ChecksPaidRecord
	checks_vs_debits: ChecksVsDebitsRecord
	daily_balance: DailyBalanceRecord
	deals: DealsRecord
	ending_balance_over_time: EndingBalanceOverTimeRecord
	extractions: ExtractionsRecord
	finance_freq: FinanceFreqRecord
	financing_as_percent_income: FinancingAsPercentIncomeRecord
	financing_details: FinancingDetailsRecord
	first_financing: FirstFinancingRecord
	funding_as_percentage_of_revenue: FundingAsPercentageOfRevenueRecord
	funding_vs_revenue: FundingVsRevenueRecord
	jobs: JobsRecord
	organizations: OrganizationsRecord
	payments_vs_income: PaymentsVsIncomeRecord
	real_revenue_by_deal: RealRevenueByDealRecord
	statement_details: StatementDetailsRecord
	statements: StatementsRecord
	total_bank_fees: TotalBankFeesRecord
	total_financeing: TotalFinanceingRecord
	total_interest: TotalInterestRecord
	transactions: TransactionsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	avg_daily_revenue: AvgDailyRevenueResponse
	avg_monthly_revenue: AvgMonthlyRevenueResponse
	avg_weekly_revenue: AvgWeeklyRevenueResponse
	balance_over_time: BalanceOverTimeResponse
	checks_paid: ChecksPaidResponse
	checks_vs_debits: ChecksVsDebitsResponse
	daily_balance: DailyBalanceResponse
	deals: DealsResponse
	ending_balance_over_time: EndingBalanceOverTimeResponse
	extractions: ExtractionsResponse
	finance_freq: FinanceFreqResponse
	financing_as_percent_income: FinancingAsPercentIncomeResponse
	financing_details: FinancingDetailsResponse
	first_financing: FirstFinancingResponse
	funding_as_percentage_of_revenue: FundingAsPercentageOfRevenueResponse
	funding_vs_revenue: FundingVsRevenueResponse
	jobs: JobsResponse
	organizations: OrganizationsResponse
	payments_vs_income: PaymentsVsIncomeResponse
	real_revenue_by_deal: RealRevenueByDealResponse
	statement_details: StatementDetailsResponse
	statements: StatementsResponse
	total_bank_fees: TotalBankFeesResponse
	total_financeing: TotalFinanceingResponse
	total_interest: TotalInterestResponse
	transactions: TransactionsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'avg_daily_revenue'): RecordService<AvgDailyRevenueResponse>
	collection(idOrName: 'avg_monthly_revenue'): RecordService<AvgMonthlyRevenueResponse>
	collection(idOrName: 'avg_weekly_revenue'): RecordService<AvgWeeklyRevenueResponse>
	collection(idOrName: 'balance_over_time'): RecordService<BalanceOverTimeResponse>
	collection(idOrName: 'checks_paid'): RecordService<ChecksPaidResponse>
	collection(idOrName: 'checks_vs_debits'): RecordService<ChecksVsDebitsResponse>
	collection(idOrName: 'daily_balance'): RecordService<DailyBalanceResponse>
	collection(idOrName: 'deals'): RecordService<DealsResponse>
	collection(idOrName: 'ending_balance_over_time'): RecordService<EndingBalanceOverTimeResponse>
	collection(idOrName: 'extractions'): RecordService<ExtractionsResponse>
	collection(idOrName: 'finance_freq'): RecordService<FinanceFreqResponse>
	collection(idOrName: 'financing_as_percent_income'): RecordService<FinancingAsPercentIncomeResponse>
	collection(idOrName: 'financing_details'): RecordService<FinancingDetailsResponse>
	collection(idOrName: 'first_financing'): RecordService<FirstFinancingResponse>
	collection(idOrName: 'funding_as_percentage_of_revenue'): RecordService<FundingAsPercentageOfRevenueResponse>
	collection(idOrName: 'funding_vs_revenue'): RecordService<FundingVsRevenueResponse>
	collection(idOrName: 'jobs'): RecordService<JobsResponse>
	collection(idOrName: 'organizations'): RecordService<OrganizationsResponse>
	collection(idOrName: 'payments_vs_income'): RecordService<PaymentsVsIncomeResponse>
	collection(idOrName: 'real_revenue_by_deal'): RecordService<RealRevenueByDealResponse>
	collection(idOrName: 'statement_details'): RecordService<StatementDetailsResponse>
	collection(idOrName: 'statements'): RecordService<StatementsResponse>
	collection(idOrName: 'total_bank_fees'): RecordService<TotalBankFeesResponse>
	collection(idOrName: 'total_financeing'): RecordService<TotalFinanceingResponse>
	collection(idOrName: 'total_interest'): RecordService<TotalInterestResponse>
	collection(idOrName: 'transactions'): RecordService<TransactionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
