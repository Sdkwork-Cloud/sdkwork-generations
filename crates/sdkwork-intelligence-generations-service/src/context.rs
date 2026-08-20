//! Request context for the generations service.

/// HTTP request context injected by the web framework.
#[derive(Debug, Clone)]
pub struct GenerationsHttpRequestContext {
    /// Authenticated tenant id.
    pub tenant_id: String,
    /// Authenticated user id.
    pub user_id: String,
    /// Request correlation id.
    pub trace_id: String,
}

/// Business-level request context.
///
/// Carries the authenticated principal identity and trace correlation
/// through the service and port boundaries.
#[derive(Debug, Clone)]
pub struct GenerationsRequestContext {
    pub http: GenerationsHttpRequestContext,
}

impl GenerationsRequestContext {
    /// Create a new request context from the HTTP context.
    pub fn new(http: GenerationsHttpRequestContext) -> Self {
        Self { http }
    }

    /// Construct from individual fields.
    pub fn from_parts(tenant_id: String, user_id: String, trace_id: String) -> Self {
        Self {
            http: GenerationsHttpRequestContext {
                tenant_id,
                user_id,
                trace_id,
            },
        }
    }
}
