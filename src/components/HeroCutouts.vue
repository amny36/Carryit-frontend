<!--
  HeroCutouts.vue
  Painterly SVG cutouts of airport-vibe items: passport, harissa tube, croissant,
  perfume, sneakers, suitcase, ticket, etc. Used in LandingPage.vue hero.

  Usage:  <HeroCutout name="passport" :size="150" />
-->
<template>
  <component :is="renderFn" />
</template>

<script setup>
import { h } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 110 },
  color: { type: String, default: 'burgundy' },  // for passport
})

// Helper to write SVG with vue's render function (cleaner than long template)
function svg(attrs, children) {
  return h('svg', { xmlns: 'http://www.w3.org/2000/svg', style: 'display:block', ...attrs }, children)
}
const e = (tag, attrs, kids) => h(tag, attrs, kids)

const cutouts = {
  // ── HARISSA TUBE ──
  harissa: () => svg(
    { width: props.size * 0.55, height: props.size, viewBox: '0 0 80 150' },
    [
      e('defs', null, [
        h('linearGradient', { id: 'harissa-tube', x1: '0', y1: '0', x2: '1', y2: '0' }, [
          h('stop', { offset: '0', 'stop-color': '#fff7e6' }),
          h('stop', { offset: '0.5', 'stop-color': '#fff' }),
          h('stop', { offset: '1', 'stop-color': '#d8c9a0' }),
        ]),
        h('linearGradient', { id: 'harissa-cap', x1: '0', y1: '0', x2: '0', y2: '1' }, [
          h('stop', { offset: '0', 'stop-color': '#1a1a1a' }),
          h('stop', { offset: '1', 'stop-color': '#3a3a3a' }),
        ]),
      ]),
      e('path', { d: 'M 18 30 L 62 30 L 60 130 Q 58 142 40 142 Q 22 142 20 130 Z', fill: 'url(#harissa-tube)', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('path', { d: 'M 22 142 L 18 148 L 62 148 L 58 142 Z', fill: '#bba374', stroke: '#14110D', 'stroke-width': '1.2' }),
      e('line', { x1: '24', y1: '143', x2: '56', y2: '143', stroke: '#14110D', 'stroke-width': '0.6', 'stroke-dasharray': '2 2' }),
      e('rect', { x: '22', y: '14', width: '36', height: '22', fill: 'url(#harissa-cap)', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('rect', { x: '22', y: '14', width: '36', height: '3', fill: '#000' }),
      e('rect', { x: '20', y: '44', width: '40', height: '68', fill: '#B0392E', stroke: '#14110D', 'stroke-width': '1' }),
      e('rect', { x: '22', y: '46', width: '36', height: '64', fill: 'none', stroke: '#E2C883', 'stroke-width': '0.8' }),
      e('text', { x: '40', y: '60', 'text-anchor': 'middle', 'font-family': 'Cormorant Garamond, serif', 'font-size': '11', 'font-weight': '700', fill: '#F1E7D2', 'font-style': 'italic' }, 'Harissa'),
      e('text', { x: '40', y: '72', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '5', fill: '#F1E7D2', 'letter-spacing': '0.1em' }, 'DU CAP BON'),
      e('path', { d: 'M 32 80 Q 40 78 48 84 Q 50 96 40 100 Q 30 96 32 80 Z', fill: '#7a1f15', stroke: '#3a0f08', 'stroke-width': '0.6' }),
      e('path', { d: 'M 38 78 L 38 74 L 41 73', stroke: '#2a4029', 'stroke-width': '1', fill: 'none' }),
      e('text', { x: '40', y: '106', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '3.5', fill: '#F1E7D2' }, 'TUNISIE · 70g'),
    ]
  ),

  // ── CROISSANT ──
  croissant: () => svg(
    { width: props.size, height: props.size * 0.55, viewBox: '0 0 200 110' },
    [
      e('defs', null, [
        h('linearGradient', { id: 'cr-base', x1: '0', y1: '0', x2: '0', y2: '1' }, [
          h('stop', { offset: '0', 'stop-color': '#e8b366' }),
          h('stop', { offset: '0.5', 'stop-color': '#c8893b' }),
          h('stop', { offset: '1', 'stop-color': '#8a5520' }),
        ]),
      ]),
      e('path', { d: 'M 20 70 Q 30 30 80 24 Q 130 20 170 38 Q 188 48 180 70 Q 170 86 140 86 Q 110 80 90 78 Q 60 76 36 86 Q 20 88 20 70 Z', fill: 'url(#cr-base)', stroke: '#3d2410', 'stroke-width': '1.5' }),
      ...[40,60,80,100,120,140,160].map((x, i) =>
        e('path', { key: i, d: `M ${x-8} 36 Q ${x} 56 ${x-12} 80`, stroke: '#5a3618', 'stroke-width': '1.2', fill: 'none', opacity: '0.7' })
      ),
      e('path', { d: 'M 50 40 Q 100 28 150 36', stroke: '#f5d8a8', 'stroke-width': '2', fill: 'none', opacity: '0.6' }),
      e('path', { d: 'M 16 72 Q 22 66 30 70 Q 28 80 22 82 Z', fill: '#5a3618', stroke: '#3d2410', 'stroke-width': '1' }),
      e('path', { d: 'M 178 50 Q 188 56 184 68 Q 178 70 174 64 Z', fill: '#5a3618', stroke: '#3d2410', 'stroke-width': '1' }),
    ]
  ),

  // ── PASSPORT ──
  passport: () => {
    const cover = props.color === 'green' ? '#2A4029' : '#5a1f1f'
    const coverLight = props.color === 'green' ? '#3D5B3E' : '#7a2a2a'
    return svg(
      { width: props.size * 0.72, height: props.size, viewBox: '0 0 100 140' },
      [
        e('defs', null, [
          h('linearGradient', { id: `pp-${props.color}`, x1: '0', y1: '0', x2: '1', y2: '1' }, [
            h('stop', { offset: '0', 'stop-color': coverLight }),
            h('stop', { offset: '1', 'stop-color': cover }),
          ]),
        ]),
        e('rect', { x: '6', y: '8', width: '92', height: '128', fill: '#fffaee', stroke: '#14110D', 'stroke-width': '1' }),
        e('rect', { x: '4', y: '6', width: '92', height: '128', fill: `url(#pp-${props.color})`, stroke: '#14110D', 'stroke-width': '1.5' }),
        e('circle', { cx: '50', cy: '56', r: '20', fill: 'none', stroke: '#C9A24A', 'stroke-width': '1.2' }),
        e('circle', { cx: '50', cy: '56', r: '16', fill: 'none', stroke: '#C9A24A', 'stroke-width': '0.8' }),
        e('text', { x: '50', y: '50', 'text-anchor': 'middle', 'font-family': 'Cormorant Garamond, serif', 'font-style': 'italic', 'font-size': '8', fill: '#C9A24A' }, 'CarryIt'),
        e('path', { d: 'M 44 58 L 56 58 M 48 62 L 52 62', stroke: '#C9A24A', 'stroke-width': '1' }),
        e('text', { x: '50', y: '28', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '5', fill: '#C9A24A', 'letter-spacing': '0.2em' }, 'PASSPORT'),
        e('text', { x: '50', y: '36', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '3.5', fill: '#C9A24A', 'letter-spacing': '0.15em' }, 'OF CARRIAGE'),
        e('text', { x: '50', y: '100', 'text-anchor': 'middle', 'font-family': 'Cormorant Garamond, serif', 'font-style': 'italic', 'font-size': '9', fill: '#C9A24A' }, 'Tunisie'),
        e('line', { x1: '22', y1: '110', x2: '78', y2: '110', stroke: '#C9A24A', 'stroke-width': '0.6' }),
        e('text', { x: '50', y: '120', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '3.5', fill: '#C9A24A', 'letter-spacing': '0.2em' }, 'RÉPUBLIQUE'),
      ]
    )
  },

  // ── PERFUME ──
  perfume: () => svg(
    { width: props.size * 0.7, height: props.size, viewBox: '0 0 70 100' },
    [
      e('defs', null, [
        h('linearGradient', { id: 'pf-glass', x1: '0', y1: '0', x2: '1', y2: '1' }, [
          h('stop', { offset: '0', 'stop-color': '#fce8a8', 'stop-opacity': '0.9' }),
          h('stop', { offset: '0.5', 'stop-color': '#e8b556', 'stop-opacity': '0.85' }),
          h('stop', { offset: '1', 'stop-color': '#a37e2c', 'stop-opacity': '0.95' }),
        ]),
      ]),
      e('rect', { x: '26', y: '6', width: '18', height: '16', fill: '#1B2A4A', stroke: '#14110D', 'stroke-width': '1.2' }),
      e('rect', { x: '26', y: '6', width: '18', height: '3', fill: '#C9A24A' }),
      e('rect', { x: '30', y: '22', width: '10', height: '6', fill: '#C9A24A', stroke: '#14110D', 'stroke-width': '1' }),
      e('path', { d: 'M 14 32 L 56 32 L 60 42 L 60 88 Q 60 96 52 96 L 18 96 Q 10 96 10 88 L 10 42 Z', fill: 'url(#pf-glass)', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('path', { d: 'M 18 38 Q 16 60 20 88', stroke: '#fffceb', 'stroke-width': '3', fill: 'none', opacity: '0.7' }),
      e('rect', { x: '18', y: '50', width: '34', height: '30', fill: '#F1E7D2', stroke: '#14110D', 'stroke-width': '1' }),
      e('text', { x: '35', y: '62', 'text-anchor': 'middle', 'font-family': 'Cormorant Garamond, serif', 'font-size': '8', 'font-style': 'italic', 'font-weight': '700', fill: '#1B2A4A' }, 'Nuit'),
      e('text', { x: '35', y: '71', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '3.2', 'letter-spacing': '0.18em', fill: '#1B2A4A' }, 'DE TUNIS'),
      e('line', { x1: '22', y1: '74', x2: '48', y2: '74', stroke: '#C9A24A', 'stroke-width': '0.5' }),
      e('text', { x: '35', y: '78', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '2.5', fill: '#1B2A4A' }, 'EAU DE PARFUM 50ML'),
    ]
  ),

  // ── iPhone box ──
  iphone: () => svg(
    { width: props.size * 1.3, height: props.size, viewBox: '0 0 130 100' },
    [
      e('path', { d: 'M 10 32 L 30 16 L 122 16 L 122 84 L 102 100 L 10 100 Z', fill: '#f5f0e3', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('path', { d: 'M 10 32 L 30 16 L 122 16 L 102 32 Z', fill: '#e6dfcc', stroke: '#14110D', 'stroke-width': '1' }),
      e('rect', { x: '44', y: '44', width: '40', height: '48', rx: '4', fill: '#1B2A4A', stroke: '#14110D', 'stroke-width': '1' }),
      e('rect', { x: '48', y: '52', width: '32', height: '32', fill: '#0a0a0a' }),
      e('rect', { x: '60', y: '46', width: '8', height: '2', rx: '1', fill: '#14110D' }),
      e('text', { x: '64', y: '38', 'text-anchor': 'middle', 'font-family': 'Archivo', 'font-weight': '700', 'font-size': '6', fill: '#14110D' }, 'iPhone'),
      e('text', { x: '64', y: '98', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '3.2', 'letter-spacing': '0.1em', fill: '#14110D' }, '15 PRO · 256GB'),
    ]
  ),

  // ── SNEAKER ──
  sneaker: () => svg(
    { width: props.size, height: props.size * 0.55, viewBox: '0 0 200 110' },
    [
      e('path', { d: 'M 14 88 Q 14 100 26 100 L 178 100 Q 192 100 188 88 L 184 80 L 16 80 Z', fill: '#fafaf7', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('line', { x1: '20', y1: '90', x2: '184', y2: '90', stroke: '#14110D', 'stroke-width': '0.6', 'stroke-dasharray': '1 1.5' }),
      e('path', { d: 'M 30 80 Q 30 50 70 40 L 130 38 Q 168 42 174 60 L 180 80 Z', fill: '#1B2A4A', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('path', { d: 'M 50 70 Q 90 52 150 56 L 156 60 Q 110 60 56 76 Z', fill: '#C9A24A', stroke: '#14110D', 'stroke-width': '1' }),
      e('path', { d: 'M 30 80 Q 22 70 30 60 Q 36 56 40 60 L 40 80 Z', fill: '#0e1a30', stroke: '#14110D', 'stroke-width': '1' }),
      ...[80,96,112,128].map((x, i) => e('line', { key: i, x1: x, y1: '42', x2: x+8, y2: '60', stroke: '#fafaf7', 'stroke-width': '1.5' })),
      e('ellipse', { cx: '118', cy: '50', rx: '22', ry: '6', fill: '#fafaf7', stroke: '#14110D', 'stroke-width': '1' }),
      e('path', { d: 'M 168 60 Q 178 64 178 76', stroke: '#14110D', 'stroke-width': '0.8', fill: 'none' }),
    ]
  ),

  // ── ENVELOPE ──
  envelope: () => svg(
    { width: props.size, height: props.size * 0.6, viewBox: '0 0 200 120' },
    [
      e('rect', { x: '14', y: '14', width: '180', height: '100', fill: '#fffceb', stroke: '#14110D', 'stroke-width': '1.5' }),
      ...[...Array(20)].map((_, i) =>
        e('path', { key: `t${i}`, d: `M ${14 + i*9} 14 L ${20 + i*9} 14 L ${17 + i*9} 24 Z`, fill: i % 2 ? '#1B2A4A' : '#B0392E' })
      ),
      ...[...Array(20)].map((_, i) =>
        e('path', { key: `b${i}`, d: `M ${14 + i*9} 114 L ${20 + i*9} 114 L ${17 + i*9} 104 Z`, fill: i % 2 ? '#1B2A4A' : '#B0392E' })
      ),
      e('path', { d: 'M 14 24 L 100 78 L 194 24', fill: 'none', stroke: '#14110D', 'stroke-width': '1.2' }),
      e('text', { x: '60', y: '50', 'font-family': 'Cormorant Garamond, serif', 'font-style': 'italic', 'font-size': '11', fill: '#14110D' }, 'M. Ben Salem'),
      e('text', { x: '60', y: '62', 'font-family': 'JetBrains Mono', 'font-size': '5', 'letter-spacing': '0.1em', fill: '#14110D' }, '12 RUE DE PARIS'),
      e('text', { x: '60', y: '71', 'font-family': 'JetBrains Mono', 'font-size': '5', 'letter-spacing': '0.1em', fill: '#14110D' }, '75011 PARIS · FR'),
      e('rect', { x: '160', y: '32', width: '24', height: '28', fill: '#B0392E', stroke: '#14110D', 'stroke-width': '1' }),
      e('rect', { x: '162', y: '34', width: '20', height: '24', fill: 'none', stroke: '#F1E7D2', 'stroke-width': '0.6' }),
      e('text', { x: '172', y: '48', 'text-anchor': 'middle', 'font-family': 'Cormorant Garamond, serif', 'font-style': 'italic', 'font-size': '6', fill: '#F1E7D2' }, 'TUNISIE'),
      e('text', { x: '172', y: '56', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '4', fill: '#F1E7D2' }, '2026'),
      e('circle', { cx: '155', cy: '62', r: '12', fill: 'none', stroke: '#14110D', 'stroke-width': '0.8', opacity: '0.6' }),
      e('circle', { cx: '155', cy: '62', r: '9', fill: 'none', stroke: '#14110D', 'stroke-width': '0.5', opacity: '0.6' }),
      e('text', { x: '155', y: '64', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '3', fill: '#14110D', opacity: '0.6' }, 'TUNIS'),
    ]
  ),

  // ── OLIVE OIL ──
  olive_oil: () => svg(
    { width: props.size * 0.45, height: props.size, viewBox: '0 0 50 130' },
    [
      e('defs', null, [
        h('linearGradient', { id: 'oo-glass', x1: '0', y1: '0', x2: '1', y2: '0' }, [
          h('stop', { offset: '0', 'stop-color': '#3a4520' }),
          h('stop', { offset: '0.5', 'stop-color': '#5a6d2c' }),
          h('stop', { offset: '1', 'stop-color': '#2a3318' }),
        ]),
      ]),
      e('rect', { x: '20', y: '6', width: '10', height: '14', fill: '#14110D', stroke: '#14110D', 'stroke-width': '1' }),
      e('rect', { x: '22', y: '20', width: '6', height: '14', fill: '#7a8c5c', stroke: '#14110D', 'stroke-width': '0.8' }),
      e('path', { d: 'M 14 34 Q 8 50 8 60 L 8 116 Q 8 124 16 124 L 34 124 Q 42 124 42 116 L 42 60 Q 42 50 36 34 Z', fill: 'url(#oo-glass)', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('path', { d: 'M 14 50 Q 12 80 14 120', stroke: '#a8b87a', 'stroke-width': '1.5', fill: 'none', opacity: '0.5' }),
      e('rect', { x: '11', y: '62', width: '28', height: '44', fill: '#F1E7D2', stroke: '#14110D', 'stroke-width': '0.8' }),
      e('text', { x: '25', y: '74', 'text-anchor': 'middle', 'font-family': 'Cormorant Garamond, serif', 'font-style': 'italic', 'font-size': '6', 'font-weight': '700', fill: '#2a4029' }, 'Huile'),
      e('text', { x: '25', y: '82', 'text-anchor': 'middle', 'font-family': 'Cormorant Garamond, serif', 'font-style': 'italic', 'font-size': '6', 'font-weight': '700', fill: '#2a4029' }, "d'olive"),
      e('line', { x1: '14', y1: '86', x2: '36', y2: '86', stroke: '#C9A24A', 'stroke-width': '0.5' }),
      e('text', { x: '25', y: '92', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '2.5', 'letter-spacing': '0.1em', fill: '#2a4029' }, 'EXTRA VIERGE'),
      e('text', { x: '25', y: '100', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '2.5', fill: '#2a4029' }, 'SFAX · TN'),
    ]
  ),

  // ── MAKROUDH ──
  makroudh: () => svg(
    { width: props.size, height: props.size * 0.7, viewBox: '0 0 90 65' },
    [
      e('path', { d: 'M 8 32 L 32 6 L 82 6 L 60 32 L 82 58 L 32 58 Z', fill: '#d9a455', stroke: '#5a3618', 'stroke-width': '1.5' }),
      ...[0,1,2,3].map(i =>
        e('line', { key: i, x1: 20 + i*14, y1: '14', x2: 26 + i*14, y2: '50', stroke: '#7a4818', 'stroke-width': '0.6' })
      ),
      e('ellipse', { cx: '45', cy: '32', rx: '14', ry: '6', fill: '#3d2410', stroke: '#1a0d05', 'stroke-width': '0.6' }),
      ...[...Array(20)].map((_, i) =>
        e('circle', { key: `s${i}`, cx: 12 + (i*7) % 70, cy: 10 + (i*11) % 48, r: '0.6', fill: '#fffceb', opacity: 0.7 })
      ),
    ]
  ),

  // ── GOLD JEWELLERY BOX ──
  gold_box: () => svg(
    { width: props.size, height: props.size * 0.85, viewBox: '0 0 100 85' },
    [
      e('path', { d: 'M 10 30 L 10 78 Q 10 82 14 82 L 86 82 Q 90 82 90 78 L 90 30 Z', fill: '#5a1f1f', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('path', { d: 'M 8 30 L 92 30 L 92 24 Q 92 18 86 18 L 14 18 Q 8 18 8 24 Z', fill: '#7a2a2a', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('line', { x1: '50', y1: '30', x2: '50', y2: '82', stroke: '#C9A24A', 'stroke-width': '2' }),
      e('rect', { x: '42', y: '14', width: '16', height: '14', fill: '#C9A24A', stroke: '#14110D', 'stroke-width': '1' }),
      e('circle', { cx: '34', cy: '56', r: '9', fill: 'none', stroke: '#C9A24A', 'stroke-width': '2' }),
      e('circle', { cx: '34', cy: '50', r: '3', fill: '#E2C883', stroke: '#a37e2c', 'stroke-width': '0.6' }),
      e('text', { x: '68', y: '54', 'font-family': 'Cormorant Garamond, serif', 'font-style': 'italic', 'font-size': '14', fill: '#C9A24A' }, '✦'),
    ]
  ),

  // ── TICKET / BOARDING PASS ──
  ticket: () => svg(
    { width: props.size, height: props.size * 0.45, viewBox: '0 0 200 90' },
    [
      e('rect', { x: '2', y: '6', width: '196', height: '78', fill: '#FAF5E8', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('line', { x1: '140', y1: '6', x2: '140', y2: '84', stroke: '#14110D', 'stroke-width': '1', 'stroke-dasharray': '2 2' }),
      e('text', { x: '14', y: '32', 'font-family': 'Cormorant Garamond, serif', 'font-weight': '700', 'font-size': '20', fill: '#1B2A4A' }, 'TUN'),
      e('text', { x: '62', y: '32', 'font-family': 'JetBrains Mono', 'font-size': '14', fill: '#C9A24A' }, '→'),
      e('text', { x: '86', y: '32', 'font-family': 'Cormorant Garamond, serif', 'font-weight': '700', 'font-size': '20', fill: '#1B2A4A' }, 'CDG'),
      e('line', { x1: '10', y1: '42', x2: '130', y2: '42', stroke: '#14110D', 'stroke-width': '0.5', 'stroke-dasharray': '1.5 1.5' }),
      e('text', { x: '14', y: '56', 'font-family': 'JetBrains Mono', 'font-size': '6', 'letter-spacing': '0.1em', fill: '#14110D' }, 'FRI · APR 22 · 14:20'),
      e('text', { x: '14', y: '68', 'font-family': 'JetBrains Mono', 'font-size': '6', 'letter-spacing': '0.1em', fill: '#14110D' }, 'CARRIER · MOHAMED B.'),
      e('text', { x: '14', y: '78', 'font-family': 'JetBrains Mono', 'font-size': '5', 'letter-spacing': '0.15em', fill: '#B0392E' }, 'CI-2026-781129'),
      e('rect', { x: '148', y: '14', width: '44', height: '44', fill: '#1B2A4A' }),
      ...[...Array(64)].map((_, i) => {
        const x = 150 + (i % 8) * 5
        const y = 16 + Math.floor(i / 8) * 5
        return ((i * 37) % 100) > 45 ? e('rect', { key: `q${i}`, x, y, width: '4', height: '4', fill: '#FAF5E8' }) : null
      }).filter(Boolean),
      e('text', { x: '170', y: '76', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '5', fill: '#14110D' }, 'SCAN @ HANDOFF'),
    ]
  ),

  // ── SUITCASE ──
  suitcase: () => svg(
    { width: props.size, height: props.size * 0.85, viewBox: '0 0 110 95' },
    [
      e('path', { d: 'M 38 8 Q 38 2 44 2 L 66 2 Q 72 2 72 8 L 72 16 L 68 16 L 68 10 L 42 10 L 42 16 L 38 16 Z', fill: '#14110D' }),
      e('rect', { x: '10', y: '16', width: '90', height: '72', rx: '5', fill: '#5a3a2a', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('rect', { x: '10', y: '42', width: '90', height: '10', fill: '#3d2410', stroke: '#14110D', 'stroke-width': '1' }),
      e('rect', { x: '48', y: '38', width: '14', height: '18', fill: '#C9A24A', stroke: '#14110D', 'stroke-width': '1' }),
      ...[[10,16],[98,16],[10,84],[98,84]].map(([x,y], i) =>
        e('rect', { key: `c${i}`, x: x-2, y: y-2, width: '6', height: '6', fill: '#C9A24A', stroke: '#14110D', 'stroke-width': '0.8' })
      ),
      e('g', { transform: 'translate(20 60) rotate(-8)' }, [
        e('rect', { width: '22', height: '14', fill: 'none', stroke: '#B0392E', 'stroke-width': '1' }),
        e('text', { x: '11', y: '10', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '5', fill: '#B0392E' }, 'PARIS'),
      ]),
      e('g', { transform: 'translate(70 22) rotate(6)' }, [
        e('rect', { width: '22', height: '12', fill: 'none', stroke: '#1B2A4A', 'stroke-width': '1' }),
        e('text', { x: '11', y: '9', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '4.5', fill: '#1B2A4A' }, 'TUNIS'),
      ]),
    ]
  ),

  // ── KEYCHAIN ──
  keychain: () => svg(
    { width: props.size * 0.45, height: props.size, viewBox: '0 0 50 110' },
    [
      e('circle', { cx: '25', cy: '10', r: '6', fill: 'none', stroke: '#a8a8a8', 'stroke-width': '2.5' }),
      e('line', { x1: '25', y1: '16', x2: '25', y2: '24', stroke: '#14110D', 'stroke-width': '1' }),
      e('path', { d: 'M 15 90 L 25 30 L 35 90 Z', fill: '#C9A24A', stroke: '#14110D', 'stroke-width': '1.2' }),
      e('line', { x1: '18', y1: '70', x2: '32', y2: '70', stroke: '#14110D', 'stroke-width': '1' }),
      e('line', { x1: '20', y1: '56', x2: '30', y2: '56', stroke: '#14110D', 'stroke-width': '0.8' }),
      e('line', { x1: '22', y1: '44', x2: '28', y2: '44', stroke: '#14110D', 'stroke-width': '0.6' }),
      e('rect', { x: '12', y: '90', width: '26', height: '6', fill: '#a37e2c', stroke: '#14110D', 'stroke-width': '1' }),
      e('text', { x: '25', y: '105', 'text-anchor': 'middle', 'font-family': 'Cormorant Garamond, serif', 'font-style': 'italic', 'font-size': '7', fill: '#14110D' }, 'Paris'),
    ]
  ),

  // ── MEDICINE ──
  medicine: () => svg(
    { width: props.size, height: props.size * 0.7, viewBox: '0 0 100 70' },
    [
      e('rect', { x: '6', y: '6', width: '88', height: '58', fill: '#fafaf7', stroke: '#14110D', 'stroke-width': '1.5' }),
      e('rect', { x: '6', y: '6', width: '88', height: '14', fill: '#1B2A4A' }),
      e('text', { x: '50', y: '16', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-weight': '700', 'font-size': '6', 'letter-spacing': '0.2em', fill: '#F1E7D2' }, 'PHARMA · TN'),
      e('rect', { x: '44', y: '28', width: '12', height: '32', fill: '#B0392E' }),
      e('rect', { x: '34', y: '38', width: '32', height: '12', fill: '#B0392E' }),
      e('text', { x: '50', y: '68', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '3.5', fill: '#14110D', 'letter-spacing': '0.1em' }, 'RX · 30 CT · 500MG'),
    ]
  ),

  // ── TEA ──
  tea: () => svg(
    { width: props.size * 0.7, height: props.size, viewBox: '0 0 70 100' },
    [
      e('path', { d: 'M 28 8 Q 32 16 28 22', stroke: '#14110D', 'stroke-width': '0.8', fill: 'none', opacity: '0.5' }),
      e('path', { d: 'M 38 10 Q 42 18 38 24', stroke: '#14110D', 'stroke-width': '0.8', fill: 'none', opacity: '0.5' }),
      e('path', { d: 'M 14 30 L 56 30 L 52 92 Q 50 96 42 96 L 28 96 Q 20 96 18 92 Z', fill: '#E2C883', stroke: '#14110D', 'stroke-width': '1.5', opacity: '0.85' }),
      e('path', { d: 'M 16 36 L 54 36 L 51 86 Q 50 88 42 88 L 28 88 Q 20 88 19 86 Z', fill: '#a37e2c', opacity: '0.85' }),
      e('ellipse', { cx: '35', cy: '30', rx: '21', ry: '3', fill: 'none', stroke: '#C9A24A', 'stroke-width': '1' }),
      e('ellipse', { cx: '30', cy: '40', rx: '4', ry: '2.5', fill: '#3d5b3e', stroke: '#14110D', 'stroke-width': '0.5', transform: 'rotate(-30 30 40)' }),
      e('ellipse', { cx: '38', cy: '42', rx: '4', ry: '2.5', fill: '#5a7a3e', stroke: '#14110D', 'stroke-width': '0.5', transform: 'rotate(20 38 42)' }),
    ]
  ),

  // ── STAMP ──
  stamp: () => svg(
    { width: props.size, height: props.size, viewBox: '0 0 90 90' },
    [
      e('g', { transform: 'translate(45 45) rotate(-12)' }, [
        e('circle', { r: '38', fill: 'none', stroke: '#B0392E', 'stroke-width': '2.5' }),
        e('circle', { r: '32', fill: 'none', stroke: '#B0392E', 'stroke-width': '1' }),
        e('text', { x: '0', y: '-18', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '5', 'font-weight': '700', 'letter-spacing': '0.2em', fill: '#B0392E' }, '— APPROVED —'),
        e('text', { x: '0', y: '2', 'text-anchor': 'middle', 'font-family': 'Cormorant Garamond, serif', 'font-style': 'italic', 'font-weight': '700', 'font-size': '14', fill: '#B0392E' }, 'CarryIt'),
        e('text', { x: '0', y: '14', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '4', 'letter-spacing': '0.2em', fill: '#B0392E' }, 'CUSTOMS · 2026'),
        e('text', { x: '0', y: '24', 'text-anchor': 'middle', 'font-family': 'JetBrains Mono', 'font-size': '5', 'letter-spacing': '0.2em', fill: '#B0392E' }, '★ ★ ★'),
      ]),
    ]
  ),
}

const renderFn = cutouts[props.name] || (() => h('svg', { width: props.size, height: props.size }))
</script>
