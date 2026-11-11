import {copy} from './content.mjs';
export const fields = [
 ['erindi',copy.fieldPurpose,40,true,'radio',[copy.form_fields_001,copy.form_fields_002,copy.oilName,copy.form_fields_003,copy.form_fields_004]],
 ['name',copy.fieldName,120,true,'text'],['phone',copy.form_fields_005,40,true,'tel'],['email',copy.fieldEmail,254,copy.form_fields_006,'email'],
 ['reply',copy.form_fields_007,20,false,'radio',[copy.form_fields_008,copy.form_fields_009]],
 ['plate',copy.form_fields_010,24,'vehicle && !no_plate','text'],['foreign_plate',copy.form_fields_011,5,false,'checkbox'],['no_plate',copy.form_fields_012,5,false,'checkbox'],
 ['make',copy.fieldMake,80,'vehicle && no_plate','text'],['model',copy.form_fields_013,80,'vehicle && no_plate','text'],
 ['preferred_date',copy.form_fields_014,10,false,'date'],
 ['damage_date',copy.form_fields_015,10,false,'date'],['insurer',copy.form_fields_016,80,false,'select',['',copy.form_fields_017,copy.form_fields_018,copy.form_fields_019,copy.form_fields_020,copy.form_fields_021,copy.unknownOption,copy.form_fields_022]],
 ['other_insurer',copy.form_fields_023,120,false,'text'],['reported',copy.form_fields_024,20,false,'select',['',copy.form_fields_025,copy.noOption,copy.unknownOption]],
 ['claim_number',copy.form_fields_026,100,false,'text'],['driveable',copy.form_fields_027,20,false,'select',['',copy.form_fields_028,copy.noOption,copy.unknownOption]],['rental',copy.form_fields_029,400,false,'textarea'],
 ['mileage',copy.form_fields_030,12,false,'text'],['year',copy.form_fields_031,4,false,'text'],['subtopic',copy.fieldSubtopic,80,false,'select',[copy.form_fields_032,copy.form_fields_033,copy.form_fields_034,copy.form_fields_035]],
 ['inspection',copy.form_fields_036,800,false,'textarea'],['warning',copy.form_fields_037,400,false,'text'],['last_oil',copy.form_fields_038,120,false,'text'],
 ['alignment_reason',copy.form_fields_039,800,false,'textarea'],['wheel_changes',copy.form_fields_040,800,false,'textarea'],
 ['message',copy.form_fields_041,2000,copy.form_fields_042,'textarea'],
 ['service',copy.form_fields_043,80,false,'hidden'],['language',copy.form_fields_044,2,true,'hidden'],['page',copy.form_fields_045,300,true,'hidden'],['subject',copy.form_fields_046,100,true,'hidden'],['site',copy.fieldSite,20,true,'hidden'],['back',copy.fieldBack,300,true,'hidden'],['_honey',copy.form_fields_047,200,false,'text'],['plate_normalized',copy.form_fields_048,24,false,'hidden']
].map(([key,label,max,required,kind,options])=>({key,label,max,required,kind,...(options?{options}:{})}));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const field=(key)=>{
 const f=fields.find(f=>f.key===key);const help=key==='plate'?copy.form_help_001:key==='preferred_date'?copy.form_help_002:'';
 const common=`id="${key}" name="${key}" ${f.required===true?'required':''} aria-describedby="${key}-error${help?' '+key+'-help':''}"`;
 const autocomplete={name:'name',phone:'tel',email:'email'}[key];
 if(f.kind==='radio')return `<fieldset class="field segments-field" data-field="${key}"><legend class="mono">${f.label}${f.required?' *':''}</legend><div class="segments">${f.options.map((o,i)=>`<label class="segment"><input type="radio" id="${key}${i?'-'+i:''}" name="${key}" value="${esc(o)}" ${f.required?'required':''} ${key==='reply'&&i===0?'checked':''} aria-describedby="${key}-error"><span>${o}</span></label>`).join('')}</div><small class="field-error" id="${key}-error" aria-live="polite"></small></fieldset>`;
 const input=f.kind==='select'?`<select ${common}>${(key==='erindi'?['',...f.options]:f.options).map(o=>`<option value="${esc(o)}">${o||copy.form_input_001}</option>`).join('')}</select>`:f.kind==='textarea'?`<textarea ${common} maxlength="${f.max}" rows="4"></textarea>`:`<input ${common} type="${f.kind}" ${f.kind==='checkbox'?'value="yes"':`maxlength="${f.max}"`} ${autocomplete?`autocomplete="${autocomplete}"`:''} ${key==='plate'?'autocapitalize="characters" spellcheck="false"':''} ${['mileage','year'].includes(key)?'inputmode="numeric"':''}>`;
 return `<div class="field ${f.kind==='checkbox'?'check':''}" data-field="${key}">${f.kind==='checkbox'?`${input}<label for="${key}">${f.label}</label>`:`<label for="${key}">${f.label}${f.required===true?' *':''}</label>${input}`}${help?`<small id="${key}-help">${help}</small>`:''}<small class="field-error" id="${key}-error" aria-live="polite"></small></div>`;
};
const group=(name,html)=>`<div class="conditional" data-group="${name}"><div class="conditional-inner">${html}</div></div>`;
export function enquiryForm(hasPrivacy=false){return `<!-- facts: F001 F006 F007 F008 F012 F013 F014 F015 F016 F017 F018 F061 F065 F066 F067; UI: FORM-SPEC.md, neutral request instructions -->
<div id="sent" class="native-result" role="status"><h3>${copy.form_enquiryForm_003}</h3><p>${copy.form_enquiryForm_004}<a href="tel:+3544216901">${copy.form_enquiryForm_005}</a>${copy.form_enquiryForm_006}<a href="tel:+3544366901">${copy.form_enquiryForm_007}</a>.</p><p>${copy.form_enquiryForm_008}<a href="mailto:bilageirinn@bilageirinn.is">${copy.form_enquiryForm_009}</a>.</p></div><div id="senderror" class="native-result" role="alert"><h3>${copy.form_enquiryForm_010}</h3><p>${copy.form_enquiryForm_011}<a href="tel:+3544216901">${copy.form_enquiryForm_012}</a>${copy.form_enquiryForm_013}<a href="mailto:bilageirinn@bilageirinn.is">${copy.form_enquiryForm_014}</a>.</p></div><form id="enquiry" method="POST" action="https://sndr-contact.sindri-381.workers.dev/">
<input type="hidden" name="service" value=""><input type="hidden" name="site" value="bilageirinn"><input type="hidden" name="back" value="https://www.bilageirinn.is/hafa-samband/?sent=1"><input type="hidden" name="language" value="is"><input type="hidden" name="page" value="/hafa-samband/"><input type="hidden" name="subject" value="Bílageirinn: Fyrirspurn">
<div class="honey" aria-hidden="true"><label for="honey">${copy.form_enquiryForm_015}</label><input id="honey" name="_honey" maxlength="200" tabindex="-1" autocomplete="off"></div>
<noscript><p>${copy.form_enquiryForm_016}</p></noscript>
${field('erindi')}<p id="service-context" hidden></p>

${group('vehicle',`${group('plate-number',field('plate')+field('foreign_plate'))}${field('no_plate')}${group('make-model',`<div class="form-grid">${field('make')}${field('model')}</div>`)}`)}
${group('damage',`<p class="note">${copy.form_enquiryForm_001}</p><div class="form-grid">${field('damage_date')}${field('insurer')}</div>${group('other-insurer',field('other_insurer'))}<div class="form-grid">${field('reported')}${field('claim_number')}${field('driveable')}</div>${field('rental')}<p>${copy.form_enquiryForm_002}</p>`)}
${group('repair',`<div class="form-grid">${field('year')}${field('subtopic')}</div>${field('warning')}`)}
${group('mileage',field('mileage'))}
${group('oil',field('last_oil'))}
${group('alignment',`${field('alignment_reason')}${field('wheel_changes')}`)}
${group('inspection',field('inspection'))}
${group('date',field('preferred_date'))}
${field('message')}
<div class="form-grid">${field('name')}${field('phone')}${field('reply')}${field('email')}</div>
<p>${copy.form_enquiryForm_017}<a href="mailto:bilageirinn@bilageirinn.is">${copy.form_enquiryForm_018}</a>.</p>
<p class="privacy" id="personuvernd">${copy.labels_033}${hasPrivacy?` <a href="/personuvernd/">${copy.privacyLink}</a>`:''}</p>
<p>${copy.form_enquiryForm_019}</p>
<div id="error-summary" role="alert" tabindex="-1" hidden></div><button type="submit" class="button">${copy.form_enquiryForm_020}</button><div id="form-status" role="status" tabindex="-1"></div><pre id="dryrun-output" hidden></pre>
</form>`}
