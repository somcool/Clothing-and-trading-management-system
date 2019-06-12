<?php
	if(!empty($_FILES['image'])){
		$path = pathinfo($_FILES['image']['name'],PATHINFO_EXTENSION);
        $image = time().'.'.$path;
        move_uploaded_file($_FILES["image"]["tmp_name"], '../images/closet/'.$image);
				echo "$image";
	}else{
		// echo "<script>Error!</script>";
	}
?>
