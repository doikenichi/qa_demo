{{/*
Common labels applied to every resource in appointment-booking services.
Usage: {{ include "appointment-booking.labels" . }}
*/}}
{{- define "appointment-booking.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "appointment-booking.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels (subset of common labels, stable across upgrades).
Usage: {{ include "appointment-booking.selectorLabels" . }}
*/}}
{{- define "appointment-booking.selectorLabels" -}}
app.kubernetes.io/name: {{ include "appointment-booking.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Chart name, trimming the "-chart" suffix if present.
*/}}
{{- define "appointment-booking.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Fully qualified app name: release + chart name, max 63 characters.
*/}}
{{- define "appointment-booking.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name (include "appointment-booking.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Staff API token environment variable — injected from a Kubernetes Secret.
Never hardcoded. See NFR-005 and the Staff credential section of the spec.

Usage in a container env block:
  env:
    {{- include "appointment-booking.staffTokenEnv" . | nindent 12 }}
*/}}
{{- define "appointment-booking.staffTokenEnv" -}}
- name: STAFF_API_TOKEN
  valueFrom:
    secretKeyRef:
      name: {{ .Values.secretName | default (printf "%s-secrets" (include "appointment-booking.fullname" .)) }}
      key: STAFF_API_TOKEN
{{- end }}

{{/*
OpenTelemetry environment variables — injected from a Kubernetes Secret.
Endpoint and auth headers are never hardcoded (NFR-005).

Usage in a container env block:
  env:
    {{- include "appointment-booking.otelEnv" . | nindent 12 }}
*/}}
{{- define "appointment-booking.otelEnv" -}}
- name: OTEL_EXPORTER_OTLP_ENDPOINT
  valueFrom:
    secretKeyRef:
      name: {{ .Values.secretName | default (printf "%s-secrets" (include "appointment-booking.fullname" .)) }}
      key: OTEL_EXPORTER_OTLP_ENDPOINT
- name: OTEL_EXPORTER_OTLP_HEADERS
  valueFrom:
    secretKeyRef:
      name: {{ .Values.secretName | default (printf "%s-secrets" (include "appointment-booking.fullname" .)) }}
      key: OTEL_EXPORTER_OTLP_HEADERS
- name: OTEL_SERVICE_NAME
  value: {{ include "appointment-booking.name" . }}
- name: OTEL_RESOURCE_ATTRIBUTES
  value: "deployment.environment={{ .Release.Namespace }}"
{{- end }}
