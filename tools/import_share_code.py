"""Validate a GeoSports share code (GSQ1:...) and turn it into Question Scores rows.

Usage: python3 import_share_code.py CODE daily_scores.json players.json
  daily_scores.json / players.json: the get_values output of 'Daily Scores'!A:Z and 'Players'!A:D.
Prints JSON: {"player":..., "rows":[...], "rejected":[...]} where rows are ready for 'Question Scores'.
A day is accepted only if (1) the five question points add up to the code's total and
(2) that total equals the player's official score for that date in Daily Scores.
"""
import base64, json, sys

code, ds_path, pl_path = sys.argv[1], sys.argv[2], sys.argv[3]
assert code.startswith('GSQ1:'), 'not a GSQ1 share code'
data = json.loads(base64.b64decode(code[5:]).decode('utf-8'))
ds = json.load(open(ds_path)).get('values', [])
pl = json.load(open(pl_path)).get('values', [])
roster = {r[0]: r[1] for r in pl[1:] if r}
uid = data['id']
if uid not in roster:
    print(json.dumps({'error': f'user {uid} is not in the group roster'})); sys.exit(1)
name = roster[uid]
head = ds[0]
col = head.index(name) if name in head else None
official = {}
for r in ds[1:]:
    if r and col is not None and len(r) > col and r[col] != '':
        official[r[0]] = int(float(r[col]))
rows, rejected = [], []
for date, total, qs in data['d']:
    pts = sum(q[5] for q in qs)
    if len(qs) != 5 or pts != total:
        rejected.append([date, f'questions add to {pts}, total says {total}']); continue
    if date not in official:
        rejected.append([date, 'no official score in Daily Scores for this date yet']); continue
    if official[date] != total:
        rejected.append([date, f'official score is {official[date]}, code says {total}']); continue
    for q, loc, miles, base, mult, p in qs:
        rows.append(["'" + date, name, "'" + uid, q, loc, miles, base, mult, p, 'shared'])
print(json.dumps({'player': name, 'rows': rows, 'rejected': rejected}))
