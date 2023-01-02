#!/usr/bin/env ruby 

require 'json'

## Migration script - legacy Omega P8C 20.1 to Soyuz 21.1 translations
## : "(.*?)",? --> : "XXXXXX",      :"(.*?)",?,  --> : "XXXXXX",

base_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/en.json'; # English - origin...
soyuz_base_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/en/translation.json'; # English - target...

locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/ko-KR.json';
new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/ko/translation.json';
output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/ko/translation.populated.json';

#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/de-DE.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/de/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/de/translation.populated.json';

#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/es-ES.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/es/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/es/translation.populated.json';

#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/fr-FR.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/fr/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/fr/translation.populated.json';

#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/id-ID.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/in/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/in/translation.populated.json';

#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/ja-JP.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/ja/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/ja/translation.populated.json';

#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/ms-MY.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/ms/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/ms/translation.populated.json';

#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/pt-PT.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/pt/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/pt/translation.populated.json';

#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/ru-RU.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/ru/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/ru/translation.populated.json';


#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/th-TH.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/th/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/th/translation.populated.json';


#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/vi-VN.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/vi/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/vi/translation.populated.json';


#locale_legacy_file_path = '/Users/torrejonv/workspace/omega/commons/locales/zh-CN.json';
#new_template_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/zh/translation.json';
#output_file_path = '/Users/torrejonv/workspace/soyuz/public/locales/zh/translation.populated.json';

# 1 - load the original translations files

legacy_file = File.read(locale_legacy_file_path) # Translated

legacy_data_hash = JSON.parse(legacy_file)

legacy_base_file = File.read(base_legacy_file_path) # Base

legacy_base_data_hash = JSON.parse(legacy_base_file)



soyuz_base_file = File.read(soyuz_base_file_path) # New - English

soyuz_base_data_hash = JSON.parse(soyuz_base_file)


new_template_file = File.read(new_template_file_path) # New - to translate

new_data_hash = JSON.parse(new_template_file)



#Go through the template and find what's to be translated

def translate(parent, myHash, myBaseHash, legacy_base_data_hash, legacy_data_hash)
  myHash.dup.each {|key, value|

  	if(value.is_a?(Hash)) 
  		translate(key, value, myBaseHash[key], legacy_base_data_hash, legacy_data_hash) # recursively dive in
  	else
  		# leaf node, apply translation (if it exists) and leave
  		if value.include?('XXX')
  			# does legacy doc include an equivalent translation?
  			base_phrase = myBaseHash[key]
  			legacy_base_data_hash.each do | legacy_key, legacy_value |
			  if(legacy_value == base_phrase) 
			  	#Match between legacy and Soyuz base files! - use the translations from legacy now.
			  	legacy_translation = legacy_data_hash[legacy_key]
			  	myHash[key] = legacy_translation
			  end
			end
  		end
  	end

  }
end



translate(nil, new_data_hash, soyuz_base_data_hash, legacy_base_data_hash, legacy_data_hash);

File.write(output_file_path, JSON.dump(new_data_hash))


