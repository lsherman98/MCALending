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
	BalanceOverTime = "balance_over_time",
	ChecksPaid = "checks_paid",
	ChecksVsDebits = "checks_vs_debits",
	CurrentDeal = "current_deal",
	DailyBalance = "daily_balance",
	Deals = "deals",
	EndingBalanceOverTime = "ending_balance_over_time",
	Extractions = "extractions",
	FundingAsPercentageOfRevenue = "funding_as_percentage_of_revenue",
	Jobs = "jobs",
	Organizations = "organizations",
	PaymentsVsIncome = "payments_vs_income",
	RealRevenueByDeal = "real_revenue_by_deal",
	StatementDetails = "statement_details",
	Statements = "statements",
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

export type ChecksVsDebitsRecord<Tdeal = unknown, Ttotal_checks_amount = unknown> = {
	date?: IsoDateString
	deal?: null | Tdeal
	id: string
	statement?: RecordIdString
	total_checks_amount?: null | Ttotal_checks_amount
	total_checks_debits?: number
}

export type CurrentDealRecord = {
	created?: IsoDateString
	deal?: RecordIdString
	id: string
	updated?: IsoDateString
	user?: RecordIdString
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
	title?: string
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

export type FundingAsPercentageOfRevenueRecord<Tdeal = unknown, Tfunding_as_percentage_of_revenue = unknown, Ttotal_financing = unknown, Ttotal_revenue = unknown> = {
	deal?: null | Tdeal
	funding_as_percentage_of_revenue?: null | Tfunding_as_percentage_of_revenue
	id: string
	total_financing?: null | Ttotal_financing
	total_revenue?: null | Ttotal_revenue
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

export type RealRevenueByDealRecord<Tdeal = unknown, Treal_revenue = unknown> = {
	deal?: null | Tdeal
	id: string
	real_revenue?: null | Treal_revenue
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

export enum TransactionsTypeOptions {
	"revenue" = "revenue",
	"transfer" = "transfer",
	"funding" = "funding",
	"loan_payment" = "loan_payment",
	"business_expense" = "business_expense",
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
export type BalanceOverTimeResponse<Tdeal = unknown, Texpand = unknown> = Required<BalanceOverTimeRecord<Tdeal>> & BaseSystemFields<Texpand>
export type ChecksPaidResponse<Texpand = unknown> = Required<ChecksPaidRecord> & BaseSystemFields<Texpand>
export type ChecksVsDebitsResponse<Tdeal = unknown, Ttotal_checks_amount = unknown, Texpand = unknown> = Required<ChecksVsDebitsRecord<Tdeal, Ttotal_checks_amount>> & BaseSystemFields<Texpand>
export type CurrentDealResponse<Texpand = unknown> = Required<CurrentDealRecord> & BaseSystemFields<Texpand>
export type DailyBalanceResponse<Texpand = unknown> = Required<DailyBalanceRecord> & BaseSystemFields<Texpand>
export type DealsResponse<Texpand = unknown> = Required<DealsRecord> & BaseSystemFields<Texpand>
export type EndingBalanceOverTimeResponse<Tdeal = unknown, Texpand = unknown> = Required<EndingBalanceOverTimeRecord<Tdeal>> & BaseSystemFields<Texpand>
export type ExtractionsResponse<Tdata = unknown, Texpand = unknown> = Required<ExtractionsRecord<Tdata>> & BaseSystemFields<Texpand>
export type FundingAsPercentageOfRevenueResponse<Tdeal = unknown, Tfunding_as_percentage_of_revenue = unknown, Ttotal_financing = unknown, Ttotal_revenue = unknown, Texpand = unknown> = Required<FundingAsPercentageOfRevenueRecord<Tdeal, Tfunding_as_percentage_of_revenue, Ttotal_financing, Ttotal_revenue>> & BaseSystemFields<Texpand>
export type JobsResponse<Tmetadata = unknown, Texpand = unknown> = Required<JobsRecord<Tmetadata>> & BaseSystemFields<Texpand>
export type OrganizationsResponse<Texpand = unknown> = Required<OrganizationsRecord> & BaseSystemFields<Texpand>
export type PaymentsVsIncomeResponse<Tavg_monthly_income = unknown, Tavg_monthly_payment = unknown, Tdeal = unknown, Tpayment_to_income_percentage = unknown, Texpand = unknown> = Required<PaymentsVsIncomeRecord<Tavg_monthly_income, Tavg_monthly_payment, Tdeal, Tpayment_to_income_percentage>> & BaseSystemFields<Texpand>
export type RealRevenueByDealResponse<Tdeal = unknown, Treal_revenue = unknown, Texpand = unknown> = Required<RealRevenueByDealRecord<Tdeal, Treal_revenue>> & BaseSystemFields<Texpand>
export type StatementDetailsResponse<Texpand = unknown> = Required<StatementDetailsRecord> & BaseSystemFields<Texpand>
export type StatementsResponse<Texpand = unknown> = Required<StatementsRecord> & BaseSystemFields<Texpand>
export type TransactionsResponse<Texpand = unknown> = Required<TransactionsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	balance_over_time: BalanceOverTimeRecord
	checks_paid: ChecksPaidRecord
	checks_vs_debits: ChecksVsDebitsRecord
	current_deal: CurrentDealRecord
	daily_balance: DailyBalanceRecord
	deals: DealsRecord
	ending_balance_over_time: EndingBalanceOverTimeRecord
	extractions: ExtractionsRecord
	funding_as_percentage_of_revenue: FundingAsPercentageOfRevenueRecord
	jobs: JobsRecord
	organizations: OrganizationsRecord
	payments_vs_income: PaymentsVsIncomeRecord
	real_revenue_by_deal: RealRevenueByDealRecord
	statement_details: StatementDetailsRecord
	statements: StatementsRecord
	transactions: TransactionsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	balance_over_time: BalanceOverTimeResponse
	checks_paid: ChecksPaidResponse
	checks_vs_debits: ChecksVsDebitsResponse
	current_deal: CurrentDealResponse
	daily_balance: DailyBalanceResponse
	deals: DealsResponse
	ending_balance_over_time: EndingBalanceOverTimeResponse
	extractions: ExtractionsResponse
	funding_as_percentage_of_revenue: FundingAsPercentageOfRevenueResponse
	jobs: JobsResponse
	organizations: OrganizationsResponse
	payments_vs_income: PaymentsVsIncomeResponse
	real_revenue_by_deal: RealRevenueByDealResponse
	statement_details: StatementDetailsResponse
	statements: StatementsResponse
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
	collection(idOrName: 'balance_over_time'): RecordService<BalanceOverTimeResponse>
	collection(idOrName: 'checks_paid'): RecordService<ChecksPaidResponse>
	collection(idOrName: 'checks_vs_debits'): RecordService<ChecksVsDebitsResponse>
	collection(idOrName: 'current_deal'): RecordService<CurrentDealResponse>
	collection(idOrName: 'daily_balance'): RecordService<DailyBalanceResponse>
	collection(idOrName: 'deals'): RecordService<DealsResponse>
	collection(idOrName: 'ending_balance_over_time'): RecordService<EndingBalanceOverTimeResponse>
	collection(idOrName: 'extractions'): RecordService<ExtractionsResponse>
	collection(idOrName: 'funding_as_percentage_of_revenue'): RecordService<FundingAsPercentageOfRevenueResponse>
	collection(idOrName: 'jobs'): RecordService<JobsResponse>
	collection(idOrName: 'organizations'): RecordService<OrganizationsResponse>
	collection(idOrName: 'payments_vs_income'): RecordService<PaymentsVsIncomeResponse>
	collection(idOrName: 'real_revenue_by_deal'): RecordService<RealRevenueByDealResponse>
	collection(idOrName: 'statement_details'): RecordService<StatementDetailsResponse>
	collection(idOrName: 'statements'): RecordService<StatementsResponse>
	collection(idOrName: 'transactions'): RecordService<TransactionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
