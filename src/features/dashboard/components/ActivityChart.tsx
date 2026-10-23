import { useState } from 'react'
import { formatDayLabel } from '../../../lib/dates'
import type { DailyMovementSummary } from '../../../api/types'
import './ActivityChart.scss'

const WIDTH = 640
const HEIGHT = 240
const PLOT = { top: 12, right: 8, bottom: 28, left: 32 }
const PLOT_WIDTH = WIDTH - PLOT.left - PLOT.right
const PLOT_HEIGHT = HEIGHT - PLOT.top - PLOT.bottom
const BAR_WIDTH = 18
const BAR_GAP = 2
const BAR_RADIUS = 4

const series = [
  { key: 'entries', label: 'Entradas', className: 'activity-chart__bar--entry' },
  { key: 'exits', label: 'Salidas', className: 'activity-chart__bar--exit' },
] as const

/** Smallest "nice" axis maximum (1, 2, 5 × 10ⁿ steps, halved by the middle tick) above `value`. */
function niceMax(value: number): number {
  if (value <= 4) return 4
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 5, 10].find((factor) => factor * magnitude * 2 >= value)! * magnitude
  return step * 2
}

/** Bar with rounded top corners and a square base sitting on the axis. */
function barPath(x: number, y: number, width: number, height: number): string {
  const radius = Math.min(BAR_RADIUS, height, width / 2)
  const bottom = y + height
  return [
    `M${x},${bottom}`,
    `V${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `H${x + width - radius}`,
    `Q${x + width},${y} ${x + width},${y + radius}`,
    `V${bottom}`,
    'Z',
  ].join(' ')
}

type ActivityChartProps = {
  data: DailyMovementSummary[]
}

/** Grouped bars of entries and exits per day, with a hover/focus tooltip and a table for screen readers. */
export function ActivityChart({ data }: ActivityChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const maxValue = niceMax(Math.max(...data.flatMap((day) => [day.entries, day.exits])))
  const ticks = [0, maxValue / 2, maxValue]
  const groupWidth = PLOT_WIDTH / data.length
  const scaleY = (value: number) => PLOT.top + PLOT_HEIGHT - (value / maxValue) * PLOT_HEIGHT
  const active = activeIndex === null ? null : data[activeIndex]

  return (
    <figure className="activity-chart">
      <ul className="activity-chart__legend">
        {series.map(({ key, label, className }) => (
          <li key={key}>
            <span className={`activity-chart__swatch ${className}`} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      <div className="activity-chart__plot" onMouseLeave={() => setActiveIndex(null)}>
        {/* Hidden from assistive tech: the table below carries the same numbers. */}
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true">
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                className="activity-chart__grid"
                x1={PLOT.left}
                x2={WIDTH - PLOT.right}
                y1={scaleY(tick)}
                y2={scaleY(tick)}
              />
              <text
                className="activity-chart__axis"
                x={PLOT.left - 8}
                y={scaleY(tick)}
                dy="0.32em"
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          ))}

          {data.map((day, index) => {
            const groupX = PLOT.left + index * groupWidth
            const barsX = groupX + (groupWidth - (BAR_WIDTH * 2 + BAR_GAP)) / 2
            return (
              <g key={day.date}>
                {index === activeIndex && (
                  <rect
                    className="activity-chart__highlight"
                    x={groupX + 4}
                    y={PLOT.top}
                    width={groupWidth - 8}
                    height={PLOT_HEIGHT}
                    rx={6}
                  />
                )}
                {series.map(({ key, className }, seriesIndex) => {
                  const value = day[key]
                  if (value === 0) return null
                  const y = scaleY(value)
                  return (
                    <path
                      key={key}
                      className={`activity-chart__bar ${className}`}
                      d={barPath(
                        barsX + seriesIndex * (BAR_WIDTH + BAR_GAP),
                        y,
                        BAR_WIDTH,
                        PLOT.top + PLOT_HEIGHT - y,
                      )}
                    />
                  )
                })}
                <text
                  className="activity-chart__axis"
                  x={groupX + groupWidth / 2}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                >
                  {formatDayLabel(day.date)}
                </text>
                {/* Hit target: the whole day column, larger than the bars. */}
                <rect
                  x={groupX}
                  y={0}
                  width={groupWidth}
                  height={HEIGHT}
                  fill="transparent"
                  onMouseEnter={() => setActiveIndex(index)}
                />
              </g>
            )
          })}
          <line
            className="activity-chart__baseline"
            x1={PLOT.left}
            x2={WIDTH - PLOT.right}
            y1={PLOT.top + PLOT_HEIGHT}
            y2={PLOT.top + PLOT_HEIGHT}
          />
        </svg>

        {active && activeIndex !== null && (
          <div
            className="activity-chart__tooltip"
            // Centered on the day, but kept inside the plot at both ends.
            style={{
              left: `${Math.min(Math.max(((PLOT.left + (activeIndex + 0.5) * groupWidth) / WIDTH) * 100, 14), 86)}%`,
            }}
          >
            <strong>{formatDayLabel(active.date)}</strong>
            {series.map(({ key, label, className }) => (
              <span key={key} className="activity-chart__tooltip-row">
                <span className={`activity-chart__swatch ${className}`} aria-hidden="true" />
                {label}
                <b>{active[key]}</b>
              </span>
            ))}
          </div>
        )}
      </div>

      <table className="visually-hidden">
        <caption>Entradas y salidas por día</caption>
        <thead>
          <tr>
            <th scope="col">Día</th>
            <th scope="col">Entradas</th>
            <th scope="col">Salidas</th>
          </tr>
        </thead>
        <tbody>
          {data.map((day) => (
            <tr key={day.date}>
              <th scope="row">{formatDayLabel(day.date)}</th>
              <td>{day.entries}</td>
              <td>{day.exits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
