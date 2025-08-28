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
	ChecksPaid = "checks_paid",
	DailyBalance = "daily_balance",
	Deals = "deals",
	ExtractionAgents = "extraction_agents",
	ExtractionResults = "extraction_results",
	Jobs = "jobs",
	Organizations = "organizations",
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
	statements?: RecordIdString[]
	updated?: IsoDateString
	user: RecordIdString
	zipcode?: number
}

export type ExtractionAgentsRecord = {
	agent: string
	agent_id: string
	bank?: string
	created?: IsoDateString
	id: string
	updated?: IsoDateString
}

export type ExtractionResultsRecord = {
	created?: IsoDateString
	extracted_data: string
	id: string
	job: RecordIdString
	updated?: IsoDateString
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
	created?: IsoDateString
	credits?: number
	deal: RecordIdString
	document_tokens?: number
	extraction_result?: RecordIdString
	id: string
	job_id: string
	metadata?: null | Tmetadata
	num_pages?: number
	organization?: RecordIdString
	output_tokens?: number
	run_id: string
	statement: RecordIdString
	status?: JobsStatusOptions
	updated?: IsoDateString
	user: RecordIdString
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

export type StatementsRecord = {
	beginning_balance?: number
	created?: IsoDateString
	days_in_period?: number
	deal: RecordIdString
	ending_balance?: number
	file: string
	filename: string
	id: string
	interest_paid?: number
	job?: RecordIdString
	llama_index_file_id?: string
	organization?: RecordIdString
	service_charge?: number
	statement_date?: IsoDateString
	total_checks_debits?: number
	total_deposits_credits?: number
	total_overdraft_fee?: number
	total_returned_item_fees?: number
	updated?: IsoDateString
	user: RecordIdString
}

export enum TransactionsTypeOptions {
	"revenue" = "revenue",
	"transfer" = "transfer",
	"financing" = "financing",
}
export type TransactionsRecord = {
	amount: number
	created?: IsoDateString
	date: IsoDateString
	deal: RecordIdString
	description: string
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
export type ChecksPaidResponse<Texpand = unknown> = Required<ChecksPaidRecord> & BaseSystemFields<Texpand>
export type DailyBalanceResponse<Texpand = unknown> = Required<DailyBalanceRecord> & BaseSystemFields<Texpand>
export type DealsResponse<Texpand = unknown> = Required<DealsRecord> & BaseSystemFields<Texpand>
export type ExtractionAgentsResponse<Texpand = unknown> = Required<ExtractionAgentsRecord> & BaseSystemFields<Texpand>
export type ExtractionResultsResponse<Texpand = unknown> = Required<ExtractionResultsRecord> & BaseSystemFields<Texpand>
export type JobsResponse<Tmetadata = unknown, Texpand = unknown> = Required<JobsRecord<Tmetadata>> & BaseSystemFields<Texpand>
export type OrganizationsResponse<Texpand = unknown> = Required<OrganizationsRecord> & BaseSystemFields<Texpand>
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
	checks_paid: ChecksPaidRecord
	daily_balance: DailyBalanceRecord
	deals: DealsRecord
	extraction_agents: ExtractionAgentsRecord
	extraction_results: ExtractionResultsRecord
	jobs: JobsRecord
	organizations: OrganizationsRecord
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
	checks_paid: ChecksPaidResponse
	daily_balance: DailyBalanceResponse
	deals: DealsResponse
	extraction_agents: ExtractionAgentsResponse
	extraction_results: ExtractionResultsResponse
	jobs: JobsResponse
	organizations: OrganizationsResponse
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
	collection(idOrName: 'checks_paid'): RecordService<ChecksPaidResponse>
	collection(idOrName: 'daily_balance'): RecordService<DailyBalanceResponse>
	collection(idOrName: 'deals'): RecordService<DealsResponse>
	collection(idOrName: 'extraction_agents'): RecordService<ExtractionAgentsResponse>
	collection(idOrName: 'extraction_results'): RecordService<ExtractionResultsResponse>
	collection(idOrName: 'jobs'): RecordService<JobsResponse>
	collection(idOrName: 'organizations'): RecordService<OrganizationsResponse>
	collection(idOrName: 'statements'): RecordService<StatementsResponse>
	collection(idOrName: 'transactions'): RecordService<TransactionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
