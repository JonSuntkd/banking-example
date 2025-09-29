-- Database Schema: Banking System
-- ======================================================
-- Updated with required field constraints
-- ======================================================

-- ======================================================
-- Table: person
-- ======================================================
CREATE TABLE person (
    person_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name       VARCHAR(100) NOT NULL,        -- OBLIGATORIO para crear cliente
    gender          VARCHAR(10) CHECK (gender IN ('HOMBRE', 'MUJER', 'OTRO')),  -- Opcional
    age             INT CHECK (age >= 0),         -- Opcional
    identification  VARCHAR(50) UNIQUE,           -- Opcional (removido NOT NULL)
    address         VARCHAR(255) NOT NULL,        -- OBLIGATORIO para crear cliente
    phone           VARCHAR(20) NOT NULL          -- OBLIGATORIO para crear cliente
);

-- ======================================================
-- Table: client
-- ======================================================
CREATE TABLE client (
    client_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_id       BIGINT NOT NULL UNIQUE,       -- Siempre obligatorio (relación)
    password        VARCHAR(255) NOT NULL,        -- OBLIGATORIO para crear cliente
    status          BOOLEAN NOT NULL DEFAULT TRUE -- OBLIGATORIO para crear cliente
);

-- ======================================================
-- Table: account
-- ======================================================
CREATE TABLE account (
    account_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_id       BIGINT NOT NULL,              -- OBLIGATORIO (cliente)
    account_number  VARCHAR(20) UNIQUE NOT NULL,  -- OBLIGATORIO para crear cuenta
    account_type    VARCHAR(20) NOT NULL CHECK (account_type IN ('Ahorro', 'Corriente', 'Credito')), -- OBLIGATORIO (tipo)
    initial_balance NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (initial_balance >= 0), -- OBLIGATORIO (saldo inicial)
    status          BOOLEAN NOT NULL DEFAULT TRUE -- OBLIGATORIO para crear cuenta
);

-- ======================================================
-- Table: account_transaction
-- Renamed from 'transaction' to avoid reserved word
-- ======================================================
CREATE TABLE account_transaction (
    transaction_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id        BIGINT NOT NULL,            -- OBLIGATORIO (numero cuenta via relación)
    transaction_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Opcional (se genera automáticamente)
    transaction_type  VARCHAR(20) NOT NULL CHECK (transaction_type IN ('Deposito', 'Retiro')), -- OBLIGATORIO (tipo movimiento)
    amount            NUMERIC(15,2) NOT NULL CHECK (amount > 0), -- OBLIGATORIO (saldo inicial/monto)
    balance           NUMERIC(15,2) NOT NULL       -- OBLIGATORIO (estado/balance resultante)
);

-- ======================================================
-- Foreign Key Constraints
-- ======================================================
ALTER TABLE client ADD CONSTRAINT fk_client_person 
    FOREIGN KEY (person_id) REFERENCES person (person_id) ON DELETE CASCADE;

ALTER TABLE account ADD CONSTRAINT fk_account_client 
    FOREIGN KEY (client_id) REFERENCES client (client_id) ON DELETE CASCADE;

ALTER TABLE account_transaction ADD CONSTRAINT fk_transaction_account 
    FOREIGN KEY (account_id) REFERENCES account (account_id) ON DELETE CASCADE;

-- ======================================================
-- Indexes
-- ======================================================
CREATE INDEX idx_client_person        ON client (person_id);
CREATE INDEX idx_account_client       ON account (client_id);
CREATE INDEX idx_transaction_account  ON account_transaction (account_id);