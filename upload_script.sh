

export JOB_NAME=SOYUZ_LOCAL;
export BUILD_NUMBER=1;

rm -rf /tmp/soyuz*
cp -r build /tmp/soyuz; cd /tmp

zip -r /tmp/soyuz-${JOB_NAME}-${BUILD_NUMBER}.platform soyuz



ssh p8@p8cfe01.betica.tw "mkdir -p platform/apps/soyuz/releases"
ssh p8@p8cfe02.betica.tw "mkdir -p platform/apps/soyuz/releases"

# Copy to servers
scp /tmp/soyuz-${JOB_NAME}-${BUILD_NUMBER}.platform abp@taibackup.betica.tw:packages

ssh abp@taibackup.betica.tw "scp packages/soyuz-${JOB_NAME}-${BUILD_NUMBER}.platform p8@p8cfe01.betica.tw:platform/apps/soyuz/releases"

ssh abp@taibackup.betica.tw "scp packages/soyuz-${JOB_NAME}-${BUILD_NUMBER}.platform p8@p8cfe02.betica.tw:platform/apps/soyuz/releases"


# Install soyuz
ssh abp@taibackup.betica.tw "ssh p8@p8cfe01.betica.tw \". .*profile; p8 install platform/apps/soyuz/releases/soyuz-${JOB_NAME}-${BUILD_NUMBER}.platform\""

ssh abp@taibackup.betica.tw "ssh p8@p8cfe02.betica.tw \". .*profile; p8 install platform/apps/soyuz/releases/soyuz-${JOB_NAME}-${BUILD_NUMBER}.platform\""


# Create Current
ssh abp@taibackup.betica.tw "ssh p8@p8cfe01.betica.tw \"rm -f ~/platform/apps/soyuz/current; ln -s ~/platform/apps/soyuz/releases/soyuz-${JOB_NAME}-${BUILD_NUMBER} ~/platform/apps/soyuz/current\""

ssh abp@taibackup.betica.tw "ssh p8@p8cfe02.betica.tw \"rm -f ~/platform/apps/soyuz/current; ln -s ~/platform/apps/soyuz/releases/soyuz-${JOB_NAME}-${BUILD_NUMBER} ~/platform/apps/soyuz/current\""

