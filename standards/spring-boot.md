# Standard: Spring Boot

> Load when: building or modifying Spring Boot services (Java 21+, Spring Boot 3.x).

## Structure

```
com.example.app/
  api/            @RestController + request/response DTOs (records)
  application/    services, use-case orchestration, @Transactional boundaries
  domain/         entities, value objects, domain logic, repository interfaces
  infrastructure/ JPA repositories impl, external clients, config
```

- Controllers thin; business logic in services; **JPA entities never leave the service layer** — map to DTOs (records) at the API boundary (MapStruct or explicit mappers).

## Dependency Injection

- **Constructor injection only** (single constructor — no `@Autowired` needed). No field injection.
- Beans are stateless; mutable shared state in singletons is forbidden.

## API Layer

- DTOs are Java `record`s with **Bean Validation** annotations (`@NotNull`, `@Size`, `@Email`); controllers use `@Valid`.
- Consistent error responses via `@RestControllerAdvice` + `ProblemDetail` (RFC 9457): map domain exceptions → status codes; never leak stack traces.
- Correct status codes; `ResponseEntity` only when status/headers vary — otherwise return the DTO directly.

## Persistence (JPA)

- Repository interfaces per aggregate; derived queries for simple cases, `@Query` (JPQL) for complex — native SQL only with justification.
- **No open-session-in-view**: set `spring.jpa.open-in-view=false`; fetch what you need explicitly (`join fetch`, `@EntityGraph`) — kill N+1 queries.
- `@Transactional` on service methods (readOnly where applicable), never on controllers.
- Pagination (`Pageable`) mandatory for list endpoints.
- Schema changes via **Flyway/Liquibase migrations** — never `ddl-auto=update` outside local dev.

## Configuration

- `@ConfigurationProperties` records over scattered `@Value`.
- Profiles per environment (`application-dev.yml`, `application-prod.yml`); secrets from environment/secret manager — never in YAML committed to git.

## Errors & Logging

- Domain exceptions extend a base `DomainException` with an error code; translated centrally in the advice.
- SLF4J with parameterized messages (`log.info("Order {} created", id)`); no `System.out`; no logging of sensitive data (see `standards/security.md`).

## Testing (Spring specifics)

- Slice tests: `@WebMvcTest` (controllers), `@DataJpaTest` + Testcontainers (repositories); full `@SpringBootTest` sparingly.
- Business logic tested as plain unit tests without the Spring context.

## Checklist

- [ ] Constructor injection; entities mapped to record DTOs at the boundary
- [ ] `@Valid` on all inputs; `@RestControllerAdvice` + ProblemDetail errors
- [ ] `open-in-view=false`; no N+1; pagination on lists
- [ ] Transactions at the service layer; migrations via Flyway/Liquibase
- [ ] Secrets outside the repo; profile-based config
