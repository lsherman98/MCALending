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
	AvgDailyBalance = "avg_daily_balance",
	BalanceOverTime = "balance_over_time",
	ChecksPaid = "checks_paid",
	CreditsAndDebits = "credits_and_debits",
	CurrentDeal = "current_deal",
	DailyBalance = "daily_balance",
	Deals = "deals",
	Extractions = "extractions",
	GroupedTransactions = "grouped_transactions",
	Jobs = "jobs",
	Organizations = "organizations",
	StatementDetails = "statement_details",
	Statements = "statements",
	TotalsByMonth = "totals_by_month",
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

export type AvgDailyBalanceRecord = {
	balance?: number
	deal?: string
	id: string
	month?: string
}

export type BalanceOverTimeRecord = {
	beginning_balance?: number
	date?: IsoDateString
	deal?: string
	ending_balance?: number
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

export type CreditsAndDebitsRecord = {
	credits?: number
	date?: IsoDateString
	deal?: string
	debits?: number
	id: string
	statement?: RecordIdString
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
	city?: string
	created?: IsoDateString
	credit_score?: number
	founded?: IsoDateString
	id: string
	industry?: string
	iso?: string
	merchant?: string
	organization?: RecordIdString
	state?: string
	title?: string
	updated?: IsoDateString
	user: RecordIdString
	zip_code?: string
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

export enum GroupedTransactionsTypeOptions {
	"revenue" = "revenue",
	"transfer" = "transfer",
	"funding" = "funding",
	"none" = "none",
	"payment" = "payment",
	"expense" = "expense",
}
export type GroupedTransactionsRecord<Tdates = unknown, Tgdescription = unknown> = {
	count?: number
	dates?: null | Tdates
	deal: RecordIdString
	gdescription?: null | Tgdescription
	id: string
	total?: number
	type: GroupedTransactionsTypeOptions
}

export enum JobsStatusOptions {
	"PENDING" = "PENDING",
	"SUCCESS" = "SUCCESS",
	"ERROR" = "ERROR",
	"PARTIAL_SUCCESS" = "PARTIAL_SUCCESS",
	"CANCELLED" = "CANCELLED",
	"CLASSIFY" = "CLASSIFY",
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

export type StatementDetailsRecord = {
	beginning_balance?: number
	created?: IsoDateString
	credits?: number
	date?: IsoDateString
	days_in_period?: number
	deal?: RecordIdString
	debits?: number
	ending_balance?: number
	id: string
	interest_paid?: number
	overdraft_fee?: number
	returned_item_fees?: number
	service_charge?: number
	statement?: RecordIdString
	updated?: IsoDateString
}

export type StatementsRecord = {
	created?: IsoDateString
	deal: RecordIdString
	details?: RecordIdString
	file: string
	filename: string
	id: string
	llama_index_file_id?: string
	updated?: IsoDateString
}

export type TotalsByMonthRecord<Tdate = unknown> = {
	date?: null | Tdate
	deal?: string
	expenses?: number
	funding?: number
	id: string
	payments?: number
	revenue?: number
	transfers?: number
}

export enum TransactionsTypeOptions {
	"revenue" = "revenue",
	"transfer" = "transfer",
	"funding" = "funding",
	"none" = "none",
	"payment" = "payment",
	"expense" = "expense",
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
	type: TransactionsTypeOptions
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
export type AvgDailyBalanceResponse<Texpand = unknown> = Required<AvgDailyBalanceRecord> & BaseSystemFields<Texpand>
export type BalanceOverTimeResponse<Texpand = unknown> = Required<BalanceOverTimeRecord> & BaseSystemFields<Texpand>
export type ChecksPaidResponse<Texpand = unknown> = Required<ChecksPaidRecord> & BaseSystemFields<Texpand>
export type CreditsAndDebitsResponse<Texpand = unknown> = Required<CreditsAndDebitsRecord> & BaseSystemFields<Texpand>
export type CurrentDealResponse<Texpand = unknown> = Required<CurrentDealRecord> & BaseSystemFields<Texpand>
export type DailyBalanceResponse<Texpand = unknown> = Required<DailyBalanceRecord> & BaseSystemFields<Texpand>
export type DealsResponse<Texpand = unknown> = Required<DealsRecord> & BaseSystemFields<Texpand>
export type ExtractionsResponse<Tdata = unknown, Texpand = unknown> = Required<ExtractionsRecord<Tdata>> & BaseSystemFields<Texpand>
export type GroupedTransactionsResponse<Tdates = unknown, Tgdescription = unknown, Texpand = unknown> = Required<GroupedTransactionsRecord<Tdates, Tgdescription>> & BaseSystemFields<Texpand>
export type JobsResponse<Tmetadata = unknown, Texpand = unknown> = Required<JobsRecord<Tmetadata>> & BaseSystemFields<Texpand>
export type OrganizationsResponse<Texpand = unknown> = Required<OrganizationsRecord> & BaseSystemFields<Texpand>
export type StatementDetailsResponse<Texpand = unknown> = Required<StatementDetailsRecord> & BaseSystemFields<Texpand>
export type StatementsResponse<Texpand = unknown> = Required<StatementsRecord> & BaseSystemFields<Texpand>
export type TotalsByMonthResponse<Tdate = unknown, Texpand = unknown> = Required<TotalsByMonthRecord<Tdate>> & BaseSystemFields<Texpand>
export type TransactionsResponse<Texpand = unknown> = Required<TransactionsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	avg_daily_balance: AvgDailyBalanceRecord
	balance_over_time: BalanceOverTimeRecord
	checks_paid: ChecksPaidRecord
	credits_and_debits: CreditsAndDebitsRecord
	current_deal: CurrentDealRecord
	daily_balance: DailyBalanceRecord
	deals: DealsRecord
	extractions: ExtractionsRecord
	grouped_transactions: GroupedTransactionsRecord
	jobs: JobsRecord
	organizations: OrganizationsRecord
	statement_details: StatementDetailsRecord
	statements: StatementsRecord
	totals_by_month: TotalsByMonthRecord
	transactions: TransactionsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	avg_daily_balance: AvgDailyBalanceResponse
	balance_over_time: BalanceOverTimeResponse
	checks_paid: ChecksPaidResponse
	credits_and_debits: CreditsAndDebitsResponse
	current_deal: CurrentDealResponse
	daily_balance: DailyBalanceResponse
	deals: DealsResponse
	extractions: ExtractionsResponse
	grouped_transactions: GroupedTransactionsResponse
	jobs: JobsResponse
	organizations: OrganizationsResponse
	statement_details: StatementDetailsResponse
	statements: StatementsResponse
	totals_by_month: TotalsByMonthResponse
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
	collection(idOrName: 'avg_daily_balance'): RecordService<AvgDailyBalanceResponse>
	collection(idOrName: 'balance_over_time'): RecordService<BalanceOverTimeResponse>
	collection(idOrName: 'checks_paid'): RecordService<ChecksPaidResponse>
	collection(idOrName: 'credits_and_debits'): RecordService<CreditsAndDebitsResponse>
	collection(idOrName: 'current_deal'): RecordService<CurrentDealResponse>
	collection(idOrName: 'daily_balance'): RecordService<DailyBalanceResponse>
	collection(idOrName: 'deals'): RecordService<DealsResponse>
	collection(idOrName: 'extractions'): RecordService<ExtractionsResponse>
	collection(idOrName: 'grouped_transactions'): RecordService<GroupedTransactionsResponse>
	collection(idOrName: 'jobs'): RecordService<JobsResponse>
	collection(idOrName: 'organizations'): RecordService<OrganizationsResponse>
	collection(idOrName: 'statement_details'): RecordService<StatementDetailsResponse>
	collection(idOrName: 'statements'): RecordService<StatementsResponse>
	collection(idOrName: 'totals_by_month'): RecordService<TotalsByMonthResponse>
	collection(idOrName: 'transactions'): RecordService<TransactionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
