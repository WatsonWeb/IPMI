import json, pathlib, csv
root = pathlib.Path(__file__).resolve().parents[4]
out = pathlib.Path(__file__).resolve().parent
base = root / '.webflow/web-refresh-2026-09-23-baseline'
def read(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def write(n,v): (out/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
before=read(base/'kbyg-pages-before-task36.json')
blocks=read(base/'kbyg-blocks-before-task36.json')
schema=read(base/'kbyg-pages-schema-before-task36.json')
after=read(out/'pages-after-save.json')
allinst=[i for p in read(base/'institutes-before-task35.json')['pages'] for i in p['items']]
inst={i['id']:i for i in allinst}
events=read(root/'docs/web-refresh/evidence/task35/calendar-roster.json')['events']
old=inst['68b0aff93e4f6363f03f620b']; f=old['fieldData']
events=events+[dict(id=old['id'],slug=f['slug'],cmsName=f['name'],title=f['global-institute-title-no-year'],year=f['global-institute-year'],start=f['global-start-date'][:10],end=f['global-end-date'][:10],location=f['location'],horizon=f.get('on-the-horizon',False))]
aud={'Delegate':'d60d1331a8222b56c6d46f788019ed98','Sponsor':'8a5fbf19e97e4b162365f4a00b1cf520'}
lists=['preparation','key-dates','agenda-days','experience','faqs']
rows=[]; register=[]
for e in events:
 for audience,option in aud.items():
  existing=next((p for p in after['items'] if p['fieldData']['institute']==e['id'] and p['fieldData']['audience']==option),None)
  slug=existing['fieldData']['slug'] if existing else e['slug']+'-'+audience.lower()
  fields={s['slug']:[] if s['type']=='MultiReference' else None for s in schema['fields']}
  fields.update({'name':e['cmsName']+' '+audience,'slug':slug,'institute':e['id'],'audience':option,'hero-eyebrow':e['start']+' – '+e['end'],'hero-intro':'Placeholder — This '+audience+' guide is awaiting Operations confirmation.','hero-cta-label':'VIEW INSTITUTE GUIDE','hero-cta-url':'#welcome','welcome-eyebrow':'WELCOME','welcome-title':'Your '+audience+' guide.','welcome-intro':'<p>Placeholder — Event arrangements and instructions are awaiting Operations confirmation.</p>','welcome-body':'<p>Placeholder — '+audience+' welcome information is awaiting Operations confirmation.</p>','preparation-eyebrow':'BEFORE YOU ARRIVE','preparation-title':'Preparing for your Institute.','preparation-intro':'Placeholder — '+audience+' preparation instructions are awaiting Operations confirmation.','key-dates-eyebrow':'MARK YOUR CALENDAR','key-dates-title':'Key Dates & Deliverables.','key-dates-intro':'Placeholder — '+audience+' deadlines are awaiting Operations confirmation.','agenda-eyebrow':'EVENT PROGRAM','agenda-title':'Institute Agenda','agenda-intro':'Placeholder — The event agenda is awaiting Operations confirmation.','agenda-cta-label':'VIEW FULL INSTITUTE AGENDA','hub-eyebrow':'EVENT ACCESS','hub-title':('Attendee' if audience=='Delegate' else 'Sponsor')+' Hub.','hub-body':'<p>Placeholder — '+audience+' MeetMax access and login instructions are awaiting Operations confirmation.</p>','hub-cta-label':'OPEN '+('ATTENDEE' if audience=='Delegate' else 'SPONSOR')+' HUB','hotel-eyebrow':'HOTEL & TRAVEL','hotel-title':'Hotel & Travel.','kbyg-reservation-details':'<p>Placeholder — '+audience+' reservation instructions, eligibility, rates and deadlines are awaiting Operations confirmation.</p>','experience-eyebrow':'YOUR EXPERIENCE','experience-title':'Your Institute Experience.','experience-intro':'Placeholder — '+audience+' experience details are awaiting Operations confirmation.','contact-eyebrow':'OPERATIONS CONTACT','contact-title':'Questions Before You Go?','contact-intro':'Placeholder — The Operations contact is awaiting confirmation.'})
  if audience=='Sponsor': fields.update({'support-eyebrow':'SPONSOR SUPPORT','support-title':'Sponsor Support.','support-body':'<p>Placeholder — Sponsor support instructions and destination are awaiting Operations confirmation.</p>','support-cta-label':'SPONSOR SUPPORT'})
  if existing: fields=existing['fieldData']
  kbyginst={k:v for k,v in inst[e['id']]['fieldData'].items() if 'kbyg' in k or k in ['location','global-start-date','global-end-date','global-institute-title-no-year','global-institute-year']}
  row=dict(registerId='36-'+slug,instituteId=e['id'],instituteSlug=e['slug'],instituteCmsName=e['cmsName'],title=e['title'],year=e['year'],start=e['start'],end=e['end'],location=e['location'],horizon=e['horizon'],audience=audience,audienceOptionId=option,pageId=existing['id'] if existing else None,pageSlug=slug,url='https://ipmi.webflow.io/know-before-you-go/'+slug,coverage='existing-retain' if existing else 'missing-create-in-task25',approval='Operations approval pending',isPastRetainedPair=e['id']==old['id'],fieldData=fields,instituteSourceFields=kbyginst,scopeNotes='Keep every original ID. Empty links stay noninteractive; no invented staff/deadlines; do not borrow other event references.',requiredReplacements=['Approve coverage, event facts and all retained copy','Audience-specific preparation and ordered blocks','Key dates with exact timezone and calendar semantics','Agenda destination (task26)','Independent MeetMax hub and support destinations (task27)','Reservation eligibility, rates, links and deadlines','Experience, FAQ/support copy','Operations staff assignment and approved imagery'])
  rows.append(row)
  for field,value in fields.items():
   if not existing and (value is None or value==[] or isinstance(value,str) and 'Placeholder' in value):
    register.append(dict(id=row['registerId']+'-'+field,pageSlug=slug,pageId=None,instituteId=e['id'],audience=audience,field=field,interimValue=value,applied=False,owner='IPMI Operations',replacement='Supply approved event/audience-specific '+field+'; preserve empty optional handling until supplied.',status='Prepared for task25; not yet CMS'))
write('coverage-matrix.json',{'asOf':'2026-09-24','authority':'Provisional 26 native current/future events plus retained past HCHR pair; not final schedule/content approval','summary':{'events':27,'pairs':54,'existing':4,'missing':50},'rows':rows})
write('placeholder-fields.json',register)
write('pages-before.json',before); write('blocks-before.json',blocks);write('page-schema.json',schema)
write('block-schema.json',read(base/'kbyg-blocks-schema-before-task36.json'))
write('ownership-before.json',read(base/'kbyg-block-ownership-before-task36.json'))
delta=[]
for p in after['items']:
 b=next(i for i in before['items'] if i['id']==p['id'])
 changes={k:{'before':b['fieldData'].get(k),'after':v} for k,v in p['fieldData'].items() if b['fieldData'].get(k)!=v}
 delta.append(dict(id=p['id'],slug=p['fieldData']['slug'],beforeState={k:b[k] for k in ['isDraft','isArchived','lastPublished','lastUpdated']},afterState={k:p[k] for k in ['isDraft','isArchived','lastPublished','lastUpdated']},changes=changes))
write('existing-delta.json',delta)
for change in delta:
 for field,values in change['changes'].items():
  value=values['after']
  if isinstance(value,str) and 'Placeholder' in value:
   page=next(r for r in rows if r['pageId']==change['id'])
   register.append(dict(id=page['registerId']+'-'+field,pageSlug=page['pageSlug'],pageId=change['id'],instituteId=page['instituteId'],audience=page['audience'],field=field,interimValue=value,priorValue=values['before'],applied=True,owner='IPMI Operations',replacement='Supply approved event/audience-specific '+field,status='Applied to staging; Operations approval pending'))
write('placeholder-fields.json',register)
missing=[r for r in rows if not r['pageId']]
write('task25-create-pack.json',[{'isDraft':True,'isArchived':False,'fieldData':r['fieldData']} for r in missing])
with (out/'task25-create-pages.csv').open('w',encoding='utf-8-sig',newline='') as file:
 writer=csv.DictWriter(file,fieldnames=[s['displayName'] for s in schema['fields']]);writer.writeheader()
 for r in missing:
  record={s['displayName']:r['fieldData'][s['slug']] or '' for s in schema['fields']}
  record['Institute']=r['instituteSlug'];record['Audience']=r['audience'].lower();writer.writerow(record)
lines=['# Provisional KBYG event × audience matrix','','54 planning rows: 4 retained pages and 50 creation candidates. All rows await Operations approval. IDs and every field value are in [the JSON matrix](coverage-matrix.json). CSV Institute uses the exact native slug; map/reference-preview before importing.','','| Institute | Dates | Audience | Page | State |','| --- | --- | --- | --- | --- |']
for r in rows: lines.append('| '+r['title'].strip()+' '+str(r['year'])+' | '+r['start']+'–'+r['end']+' | '+r['audience']+' | ['+r['pageSlug']+']('+r['url']+') | '+r['coverage']+' |')
(out/'MATRIX.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('Built',len(rows),'rows;',len(missing),'missing;',len(register),'exact pending fields')

