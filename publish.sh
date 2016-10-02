#!/usr/bin/env bash

export AWS_S3_BUCKET=staging.grafana.org

export BUCKET=$AWS_S3_BUCKET

export AWS_CONFIG_FILE=$(pwd)/awsconfig

[ -e "$AWS_CONFIG_FILE" ] || usage

export AWS_DEFAULT_PROFILE=$BUCKET

echo "cfg file: $AWS_CONFIG_FILE ; profile: $AWS_DEFAULT_PROFILE"

setup_s3() {
	echo "Create $BUCKET"
	# Try creating the bucket. Ignore errors (it might already exist).
	aws s3 mb --profile $BUCKET s3://$BUCKET 2>/dev/null || true
	# Check access to the bucket.
	echo "test $BUCKET exists"
	aws s3 --profile $BUCKET ls s3://$BUCKET
	# Make the bucket accessible through website endpoints.
	echo "make $BUCKET accessible as a website"
	#aws s3 website s3://$BUCKET --index-document index.html --error-document jsearch/index.html
	s3conf=$(cat s3_website.json | envsubst)
	echo
	echo $s3conf
	echo
	aws s3api --profile $BUCKET put-bucket-website --bucket $BUCKET --website-configuration "$s3conf"
}

upload_s3() {
	src=dist/
	dst=s3://$BUCKET

	cache=max-age=3600
	if [ "$NOCACHE" ]; then
		cache=no-cache
	fi

	echo
	echo "Uploading $src"
	echo "  to $dst"
	echo

	exclude="--exclude bower/*"
	include="--recursive"

  run="aws s3 cp $src $dst $OPTIONS --profile $BUCKET --cache-control $cache --acl public-read $include $exclude"
  echo "======================="
  echo "$run"
  echo "======================="
  $run
}

setup_s3
upload_s3
