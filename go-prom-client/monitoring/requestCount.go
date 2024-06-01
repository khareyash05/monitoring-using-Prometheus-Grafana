package monitoring

import "github.com/prometheus/client_golang/prometheus"

var RequestCount *prometheus.CounterVec
var RequestDurations *prometheus.HistogramVec

func init() {
	RequestCount = prometheus.NewCounterVec(prometheus.CounterOpts{
		Name: "hd_errors_total",
		Help: "Number of hard-disk errors.",
	}, []string{"route", "method"})

	RequestDurations = prometheus.NewHistogram(prometheus.HistogramOpts{
		Name:    "http_request_duration_seconds",
		Help:    "A histogram of the HTTP request durations in seconds.",
		Buckets: prometheus.ExponentialBuckets(0.1, 1.5, 5),
	})
}
